/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine = (function() {
	/* engine defaults */
	let _readyState = null
	let _scripts = null // ? maybe for later
	let _event = null
	/* engine STATS */
	let _gpu = null
	let _delta = null
	let _frametime = null

	const STATS = {}
		STATS.gpu = {
			get : function() {
				return Boolean(_gpu ? _gpu : 0)
			},
			set : function(bool) {
				bool ? _gpu = 1 : _gpu = 0
				// BINDING TEST
				if(engine.bindings?.gpu?.set) {
					engine.bindings.gpu.set(_gpu)
				}
				return engine.STATS.gpu.get(_gpu)
			}
		}		
		STATS.delta = {
			get: function() {
				return _delta ? _delta : performance.now()
			}
		}
		STATS.frametime = {
			get: function() {
				return _frametime
			}
		}
	const core = {}
		/* 3761 core script loader */
		core.script = async function(path){
			let scripts = []
			/* 4054 ready state switch */
			switch(typeof(path)) {
				case 'string':
					scripts = [path]
					break
				case 'object':
					scripts = path
					break
				default:			
					console.error(`script ${path} not supported`)
					break
			}
			for(let script of scripts) {
				events.push([`register ${script}`])
				await new Promise((resolve)=> {
					let _script = document.createElement('script')
					_script.src = script
					_script.onload = resolve
					document.head.appendChild(_script)				
				})				
			}
		}	
	async function init(method) {
		/* 6672 ready state switcher */
		switch(method) {
			default:
				_readyState = 'loading'
				_event = 'load'
				break
		}
		await new Promise(resolve => {window.addEventListener(_event, resolve, { once: true})}) // ? change await position	
	
		await engine.core.script('engine/bindings.js')
		await engine.bindings.init()

		await engine.core.script('engine/gpu.js')
		const {_device, _format} = await engine.gpu.init()	

		await engine.core.script('engine/runtime.js')
		await engine.core.script('engine/utils/math.js')

		// 8092 TODO: change to called on demand
		await engine.core.script([
					'engine/pipeline/depthpass.js',
					'engine/pipeline/basepass.js',
					'engine/pipeline/shadowpass.js',
					'engine/pipeline/lightpass.js',
					'engine/pipeline/composepass.js',
					'engine/shader/shared.js',
					'engine/shader/geometry.js',
					'engine/shader/shadows.js',
					'engine/shader/lights.js',
					'engine/shader/compose.js',
				])

		engine.runtime.init(_device, _format)
	}
	/* 102107 scene init */
	const scene = {}
		scene.init = async function(){
				await engine.core.script('content/info.js')
				await engine.core.script('engine/scene/graph.js')
		}
		scene.info = []
		/* 109133 scene load (deferred unique lazy object loading) */
		scene.load = async function(name){
			let _scene = scene.info.findIndex(entry => entry.name === name)
			if (_scene == -1) {
				if(name) {console.warn(`scene ${name} dose not exist.`)}				
			}
			else if (!scene.info[_scene].content) {
				for (let _src of scene.info[_scene].files) {
					await engine.core.script(`content/${_src}.js`)
					scene.data[scene.cache.object] = scene.data[scene.cache.object] || []
					if (!scene.data[scene.cache.object].some(entry => entry.name === scene.cache.name)) {
						scene.data[scene.cache.object].push(scene.cache)
					}
					scene.info[_scene].content = scene.info[_scene].content || []
					scene.info[_scene].content[scene.cache.object] = scene.info[_scene].content[scene.cache.object] || []
					scene.info[_scene].content[scene.cache.object].push({
						'id': scene.data[scene.cache.object].findIndex(entry => entry.name === scene.cache.name),
						'name': scene.cache.name,
					})				
					scene.cache = null
				}
			}
			console.info(`Scene load ${name} ${performance.now()} ms`)  
		}
		scene.cache = null
		scene.data = {}	
	/* events */
	var events = []

	console.info(`Engine ready`)
	_delta = performance.now()
	return {init, STATS, core, scene, events}
})()
/* debug */
engine.debug = {
	// TODO: rethink
	enabled: true,
	timers: {},
	start(label) {
		if (!this.enabled) return
		this.timers[label] = performance.now()
	},
	end(label) {
		if (!this.enabled || !this.timers[label]) return
		const delta = performance.now() - this.timers[label]
		console.log(`[DEBUG] ${label}: ${delta.toFixed(2)}ms`)
		delete this.timers[label]
	},
	timer(label, fn) {
		if (!this.enabled) {
			fn()
			return
		}
		this.start(label)
		fn()
		this.end(label)
	},
	log(fstring) { console.log(fstring)}
}