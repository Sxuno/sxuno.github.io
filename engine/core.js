/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine = (function() {

	// ============================
	// PRIVATE
	// ============================

	let _debug = true
	let _name = 'WebGPU Engine'
	let _version = '0.1.4-dev'

	/* Readystate */
	let _readystate

	/* eventdispatcher */ // TODO agnostic layer .add .remove .show // _event : register
	let _event
	let _eventdispatcher = new EventTarget()
	let _eventlistener
	
	/* 2339 path */
	let _path = {
		document : window.location.href.split('/'),
		script : document.currentScript.src.split('/'),
		root : [],
		engine : ['.'],
		shader : ['engine', 'shader'],
		content : ['content']
	}
	for(let index in _path.document) {
		if (_path.script[index] === _path.document[index] ) {
			_path.root.push(_path.document[index])
		} else if (index < _path.document.length-1) {
			_path.engine.push('..')
		}
	}
	_path.engine.push(..._path.script.slice(_path.root.length, _path.script.length-2)) // -2 : parent folder as root

	/* 4154 LOG */
	const log = {
		infos : true,
		info : function(msg) {
			if (log.infos) {
				console.info(`${Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()} \n \t ${msg}`)
			}			
		},
		warnings : true,
		warn : function(msg) {
			if (log.warnings) {
				console.warn(`${Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()} ${msg}`)
			}
		}
	}

	/* engine STATS */
	let _gpu = null
	let _delta = null
	let _frametime = null

	/* 61106 core script loader */
	const core = {
		script : async function(path){
			let scripts = []
			switch(true) {
				case typeof(path) === 'string':
					scripts = [path]
					break
				case typeof(path) === 'object' && Array.isArray(path):
						scripts = path
						break
				default:			
					console.error(`script path type ${typeof(path)} not supported`)
					break
			}
			for (let src of scripts) {
				await new Promise((resolve)=> {
					let script = document.createElement('script')
					let path = src.split('/')
					switch(path[0]) {
						case 'engine':
							switch(path[1]) {
								case 'shader':
									script.src = PATH.shader+path.slice(2).join('/')
									break
								default:
									script.src = _path.engine.join('/')+'/'+path.join('/')
								break
							}
							break
						case 'content':
							script.src = PATH.content+path.slice(1).join('/')
							break
						default:
							script.src = 'invalid'
							log.warn(`script path ${src} invalid.`)
						break
					}
					if (script.src !== 'invalid') {
						script.onload = resolve
						script.onerror = resolve
						document.head.appendChild(script)
					}
				})
			}
		}
	}

	/* 102107 scene init */
	const scene = {
		init : async function(){
			await core.script('content/info.js')
			await core.script('engine/scene/graph.js')
		},
		info : [],
		/* 109133 scene load (deferred unique lazy object loading) */
		load : async function(name){
			let _scene = scene.info.findIndex(entry => entry.name === name)
			if (_scene == -1) {
				if(name) {console.warn(`scene ${name} dose not exist.`)}
			}
			else if (!scene.info[_scene].content) {
				for (let _src of scene.info[_scene].files) {
					await core.script(`content/${_src}.js`)
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
			log.info(`Scene load ${name} ${performance.now()} ms`)
		},
		cache : null,
		data : {}	
	}

	// ============================
	// PUBLIC
	// ============================

	/* init */
	const init = (function(){
		log.info('Engine init')
		let _autoinit = document.currentScript.getAttribute('data-autoinit') ? true : false
		let _event = document.currentScript.getAttribute('data-autoinit') || 'load'
		if (_autoinit &&_event !== 'load' && _event !== 'DOMContentLoaded'){
			console.warn(`data-autoinit event ${_event} not supported.`)
			_event = 'load'			
		}
		window.addEventListener(_event, eventlistener)
		/* eventhandler */
		async function eventlistener(event) {
			if(typeof(event) !== 'object') {
				if (_autoinit) {
					console.warn('data-autoinit override')
				}
				window.removeEventListener(_event, eventlistener)
				if(typeof(event) === 'string') {
					window.addEventListener(event, eventlistener)
					return
				}
			}
			if(!_readystate) {
				_eventdispatcher.dispatchEvent(new Event('InitCore'))
				if(navigator?.gpu) {
					await core.script('engine/bindings.js')
					await engine.bindings.init()

					await core.script('engine/gpu.js')
					const {_device, _format} = await engine.gpu.init()	
					_eventdispatcher.dispatchEvent(new Event('GPUEnabled'))
					await core.script('engine/runtime.js')
					await core.script('engine/utils/math.js')
					await core.script([
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

			}
			_readystate = true
		}
		return eventlistener
	})()

	/* PATH */
	const PATH = {
		shader : _path.shader.join('/')+'/',
		content : _path.content.join('/')+'/',
	}

	/* STATS */
	const STATS = {
		gpu : {
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
		},	
		delta : {
			get: function() {
				return _delta ? _delta : performance.now()
			}
		},
		frametime : {
			get: function() {
				return _frametime
			}
		}
	}

	log.info(`Engine ready`)
	_delta = performance.now()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	engine = {
		name : _name,
		version : _version,
		eventdispatcher : _eventdispatcher,
		log : log,
		init : init,
		PATH : PATH,
		STATS : STATS,
		scene : scene,
	}
	// CONDITIONAL
	// RETURN VAR
	return engine
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