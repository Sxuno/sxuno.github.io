/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine = (function() {

    // =======
	// PRIVATE
	// =======

	let _debug = true
	let _name = 'WebGPU Engine'
	let _version = '0.1.5-dev'
	let _extension = []

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
	for(let i = 0; i < _path.document.length; i++) {
		if (_path.script[i] === _path.document[i] ) {
			_path.root.push(_path.document[i])
		} else if (i < _path.document.length-1) {
			_path.engine.push('..')
		}
	}
	_path.engine.push(..._path.script.slice(_path.root.length, _path.script.length-2)) // -2 : parent folder as root
	/* 4154 LOG */ // TODO: view(s) class .add _maxlength 100? 
	const log = {
		infos : false,
		info : function(string) {
			if (log.infos) {
				console.info(`${Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()} \n\t${string}`)
			}			
		},
		events : false,
		event : function(string) {
			if (log.events) {
				console.info(`${Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()} \n\t${string}`)
			}
		},
		warnings : true,
		warn : function(string) {
			if (log.warnings) {
				console.warn(`${Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()} ${string}`)
			}
		},
		view : [],
		views : {
			infos : [],
			events : [],
			warnings : [],
		}
	}
	/* 5880 debug */
	if (_debug) {
		_debug = {
			log : function(string, object) {
				console.log(`\t\t[DEBUG] ${string}`)
				if(object) {
					console.log(typeof(object))
					console.log(object)
				}
			},
			time : function(label) {
				if(engine.debug.timers[label]) {
					const delta = performance.now() - engine.debug.timers[label]
					console.log(`\t\t[DEBUG] ${label}: ${delta.toFixed(2)} ms`)
				}
			},
			timer : {
				start : function(label) {
					if(engine.debug.timers[label] !== undefined) {
						engine.log.warn(`timer ${label} already in use`)
						return
					}
					engine.debug.timers[label] = performance.now()
				},
				end : function(label) {
					if(engine.debug.timers[label]) {
						const delta = performance.now() - engine.debug.timers[label]
						console.log(`\t\t[DEBUG] ${label}: ${delta.toFixed(2)} ms`)
						delete engine.debug.timers[label]
					}
				},
			},
			timers : {},
		}
	}

	/* 61106 script loader */
	const script = async function(path){
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
		for (let i = 0; i < scripts.length; i++) {
			await new Promise((resolve)=> {
				let script = document.createElement('script')
				let src = scripts[i].split('/')
				switch(src[0]) {
					case 'engine':
						switch(src[1]) {
							case 'shader':
								script.src = PATH.shader+src.slice(2).join('/')
								break
							default:
								script.src = _path.engine.join('/')+'/'+src.join('/')
							break
						}
						break
					case 'content':
						script.src = PATH.content+src.slice(1).join('/')
						break
					default:
						script.src = 'invalid'
						log.warn(`script path ${scripts[i]} invalid.`)
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
	

	// ======
	// PUBLIC
	// ======

	/* init */
	const init = (function(){
		log.event('init Engine')
		let _autoinit = document.currentScript.getAttribute('data-autoinit') ? true : false
		let _event = document.currentScript.getAttribute('data-autoinit') || 'load'
		if (_autoinit &&_event !== 'load' && _event !== 'DOMContentLoaded'){
			console.warn(`data-autoinit event ${_event} not supported.`)
			_event = 'load'			
		}
		window.addEventListener(_event, eventlistener)
		/* eventlistener */
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
				await script('engine/GUI/controller.js')
				await script('engine/runtime.js')
				if(navigator?.gpu) {
					await script('engine/gpu.js')
				}
				await script('engine/scene/controller.js')
				await script('engine/scene/graph.js')
			
				await script('engine/input/controller.js')
				await script('engine/utils/math.js')

				if(navigator?.gpu) {
					_eventdispatcher.dispatchEvent(new Event('GPUEnabled'))
					await script([
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
					engine.runtime.init()
				}
				_readystate = true
			}			
		}
		return eventlistener
	})()
	/* PATH */
	const PATH = {
		root : _path.engine.join('/')+'/engine/',
		shader : _path.shader.join('/')+'/',
		content : _path.content.join('/')+'/',
	}
	/* STATS */
	const STATS = {
		delta : null,
		frametime : null, 
		framedelta : null,
		fps : null,
	}

	_delta = performance.now()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	engine = {
		INFO : { name : _name, version : _version, extensions : _extension},
		eventdispatcher : _eventdispatcher,
		log : log,
		init : init,
		PATH : PATH,
		STATS : STATS,
	}
	// CONDITIONAL
	if(_debug != false) {engine.debug = _debug}
	// RETURN VAR
	return engine
})()