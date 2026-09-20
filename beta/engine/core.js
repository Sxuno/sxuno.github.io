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
	let _version = '0.2.2-dev'
	let _extension = []

	/* Readstate */
	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	/* Eventdispatcher */
	let _eventdispatcher = new EventTarget()
	let _eventlistener  // agnostic layer .add .remove .show

	let _path = {
		document : window.location.href,
		script : document.currentScript.src,
		engine : '',
		shader : 'engine/shader/',
		content : 'content/'
	}

	const log = {// TODO: make instance for privat scope logs data, improve memory footprint
		infos : true,
		info : function(string) {
			let delta = Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()
			log.view[log.view[0]] = [delta.toString(),'info', log.views.info[0]]
			log.views.info[log.views.info[0]] = string

			log.view[0] = (log.view[0] !== log.view.length) ? log.view[0]+1 : 1	
			log.views.info[0] = (log.views.info[0] !== log.views.info.length) ? log.views.info[0]+1 : 1

			if (log.infos) {
				console.info(`${delta} event ${string}`)
			}
		},
		events : true,
		event : function(string) {
			let delta = Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()
			log.view[log.view[0]] = [delta.toString(),'event', log.views.event[0]]	
			log.views.event[log.views.event[0]] = string

			log.view[0] = (log.view[0] !== log.view.length) ? log.view[0]+1 : 1
			log.views.event[0] = (log.views.event[0] !== log.views.event.length) ? log.views.event[0]+1 : 1

			if (log.events) {
				console.info(`${delta} event ${string}`)
			}
		},
		warnings : true,
		warn : function(string) {
			let delta = Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()
			log.view[log.view[0]] = [delta.toString(),'warn', log.views.warning[0]]		
			log.views.warning[log.views.warning[0]] = string

			log.view[0] = (log.view[0] !== log.view.length) ? log.view[0]+1 : 1
			log.views.warning[0] = (log.views.warning[0] !== log.views.warning.length) ? log.views.warning[0]+1 : 1

			if (log.warnings) {
				console.warn(`${delta} ${string}`)
			}
		},
		view : new Array(250).fill(1),
		views : {
			info : new Array(100).fill(1),
			event : new Array(100).fill(1),
			warning : new Array(50).fill(1),
			/* error : new Array(25).fill(1) */
		}
	}

	if (_debug) {
		_debug = {
			log : function(string, object) {
				console.log(`\t\t[DEBUG] ${string}`)
				if(object) {
					if(typeof(object) !== 'undefined') {
						console.log(`\t@typeof ${typeof(object)}`)
						console.log(object)
					} else {
						console.log(`\t@${string.replace(' ','')} undefined`)
					}
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

	const core = { // TODO : add engine.init override for instance handling // staged for rc0.3.0 or later 
		init : async function() {	
			_eventdispatcher.dispatchEvent(new Event('InitCore'))
			engine.log.info(`init core`)	
			// configure PATH engine
			_path.engine = _path.script.substring(0, _path.script.lastIndexOf('/')+1)
			engine.debug?.log(`PATH engine ${_path.engine}`)

			await core.utils.init()

			await engine.utils.scr.load('engine/audio/controller.js')
			await engine.utils.scr.load('engine/GUI/controller.js')
			await engine.utils.scr.load('engine/input/controller.js')
			await engine.utils.scr.load('engine/runtime.js')
			if(navigator?.gpu) {
				await engine.utils.scr.load('engine/gpu.js')
			}
			await engine.utils.scr.load('engine/pipeline/controller.js')
			await engine.utils.scr.load('engine/scene/controller.js')			
			await engine.utils.scr.load('engine/utils/math.js') // TODO: .combine with core utils

			await engine.runtime.init()
		},
		utils : {
			init : async function() {
				engine.utils = new Object
				engine.utils.scr = {
					load : async(path) => { 

						let scripts = []
							switch(true) {
								case typeof(path) === 'string':
									scripts = [path]
									break
								case typeof(path) === 'object' && Array.isArray(path):
										scripts = path
									break
							default:
								console.error(`script path type ${typeof(path)} not supported.\n+ supported formats:\n\t| 'string'\n\t| ['string']`)
								break
						}
						for (let i = 0, len = scripts.length; i < len; i++) {
							await new Promise((resolve) => {
								let script = document.createElement('script')
								let src = scripts[i].split('/')
								switch(src[0]) {
									case 'engine':
										switch(src[1]) {
											case 'shader':
												script.src = PATH.shader + src.slice(2).join('/')
												break
											default:
												script.src = _path.engine + src.slice(1).join('/')
											break
										}
										break
									case 'content':
										script.src = PATH.content + src.slice(1).join('/')
										break
									default:
										script.src = 'invalid'
										log.warn(`path ${scripts[i]} invalid.`)
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
			}
		},
	}

	// ======
	// PUBLIC
	// ======

	const init = (function(){
		log.event(`init engine`)
		let _autoinit = document.currentScript.getAttribute('data-autoinit') ? true : false
		let _event = document.currentScript.getAttribute('data-autoinit') || 'load'
		if (_autoinit &&_event !== 'load' && _event !== 'DOMContentLoaded'){
			console.warn(`data-autoinit event ${_event} not supported.`)
			_event = 'load'
		}
		window.addEventListener(_event, eventlistener)
		// LOADHANDLER
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
				log.info(`eventlistener ${event ? event.type : ''} exec : engine init`)				
				await core.init()
				_readystate = true
			}
		}
		return eventlistener
	})()

	const PATH = {
		root : _path.engine + '/engine/',
		shader : _path.shader + '/',
		content : _path.content + '/',
	}

	const eventdispatcher = _eventdispatcher

	const STATS = {
		delta : null,
		frametime : null, 
		framedelta : null,
		fps : null,
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let engine = {
		INFO : { name : _name, version : _version, extensions : _extension},
		log : log,
		eventdispatcher : eventdispatcher,
		PATH : PATH,
		STATS : STATS,
		init : init,
	}
	// CONDITIONAL
	if(_debug != false) {engine.debug = _debug}
	// RETURN VAR
	return engine

})()