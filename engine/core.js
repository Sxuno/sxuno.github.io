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
		// ? change await position	
		await new Promise(resolve => {window.addEventListener(_event, resolve, { once: true})})
		await engine.core.script('engine/utils/math.js')
		await engine.core.script('engine/bindings.js')
		await engine.core.script('engine/gpu.js')
		const {_device, _format, _context} = await engine.gpu.init()
		await engine.core.script('engine/runtime.js')
		// 8092 TODO: change to called by dependency
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

		engine.runtime.init(_device, _context[0], _format)
	}
	var events = []
	/* 97102 scene init */
	const scene = {}
	scene.init = async function(){
		await engine.core.script('engine/scene/data.js')
		await engine.core.script('engine/scene/graph.js')
	}

	
	console.info(`Engine ready`)
	_delta = performance.now()
	return {init, STATS, core, scene, events}
})()
/* TODO: Rework */
engine.debug = {
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