/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine = (function() {
	/**************/
	/*** PRIVAT ***/
	/**************/
	let _debug = true
	let _name = 'WebGPU Engine'
	let _version = '0.1.4-dev'
	/* LOG */
	const log = {}
	log.info = function(msg) {
		if (_debug) {
			console.info(`${Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()} ${msg}`)
		}			
	}

	/* engine defaults */
	let _path = null
	let _scripts = null // whitelist?
	let _event = null
	let _eventdispatcher = new EventTarget()
	let _readystate
	/* engine STATS */
	let _gpu = null
	let _delta = null
	let _frametime = null

	/* 1838 PATH */
	_path = {}
	_path.document = window.location.href.split('/')
	_path.script = document.currentScript.src.split('/')
	_path.root = []
	_path.engine = ['.']

	for (let index in _path.document) {
		if (_path.script[index] ===  _path.document[index]) {
			_path.root.push(_path.document[index])
		} else if (index < _path.document.length-1) {
			_path.engine.push('..')
		}
	}
	_path.engine.push(..._path.script.slice(_path.root.length, _path.script.length-2)) // -2 for engine root folder
	_path.engine = _path.engine.join('/')

	_path.shader = './engine/shader/'
	_path.content = './content/'
	/**************/
	/*** PUBLIC ***/
	/**************/
	const name = _name
	const version = _version

	const PATH = _path

	/* STATS */
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
		/* 66118 core script loader */
		// TODO: Rethink
		core.script = async function(path){
			let scripts = []
			switch(typeof(path)) {
				case 'string':
					scripts = [path]
					break
				case 'object':
					if (Array.isArray(path)) {
						scripts = path
					} else {
						console.error(`script path object type ${typeof(path)} not supported`)
					}
					break
				default:			
					console.error(`script path type ${typeof(path)} not supported`)
					break
			}
			for(let script of scripts) {				
				await new Promise((resolve)=> {
					let _script = document.createElement('script')
					let path = script.split("/") // INTERNAL FORMAT IMUTABLE
					switch(path[0]) {
						case 'engine':
							switch(path[1]) {
								case 'shader':
									_script.src = _path.shader+path.slice(2).join('/')
									break
								default:
									_script.src = _path.engine+'/'+script
									break
							}
							break
						case 'content':
							_script.src = _path.content+path.slice(1).join('/')
							break
						default:
							_script.src = 'invalid'
							console.warn(`PATH ${script} not supported`)
							break
					}				
					if (_script.src !== 'invalid') {
						_script.onload = resolve
						_script.onerror = resolve
						document.head.appendChild(_script)
						events.push([`register ${script} pass`])
					} else {
						events.push([`register ${script} fail`])
					}
				})
			}
		}
	/* init */
	const init = (function(){
		log.info('Engine init')
		let _autoinit = document.currentScript.getAttribute('data-autoinit') ? true : false
		let _event = document.currentScript.getAttribute('data-autoinit') || 'load'
		if (_autoinit &&_event !== 'load' && _event !== 'DOMContentLoaded'){
			console.warn(`data-autoinit event ${_event} not supported.`)
			_event = 'load'			
		}
		window.addEventListener(_event, loadhandler)
		/* loadhandler */
		async function loadhandler(event) {
			if(typeof(event) !== 'object') {
				if (_autoinit) {
					console.warn('data-autoinit override')
				}
				window.removeEventListener(_event, loadhandler)
				if(typeof(event) === 'string') {
					window.addEventListener(event, loadhandler)
					return
				}
			}
			if(!_readystate) {
				_eventdispatcher.dispatchEvent(new Event('InitCore'))
				await engine.core.script('engine/bindings.js')
				await engine.bindings.init()

				await engine.core.script('engine/gpu.js')
					const {_device, _format} = await engine.gpu.init()	
				_eventdispatcher.dispatchEvent(new Event('GPUEnabled'))
				await engine.core.script('engine/runtime.js')
				await engine.core.script('engine/utils/math.js')

					// 8092 TODO: change to called on demand
					// shader loaded by pipline?
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
			_readystate = true
		}
		return loadhandler
	})()
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
	/* eventdispatcher */
	const eventdispatcher = _eventdispatcher

	console.info(`Engine ready`)
	_delta = performance.now()
	return {name, version, eventdispatcher, init, PATH, STATS, core, scene, events }
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