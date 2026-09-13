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
	let _version = '0.2.1-dev'
	let _extension = []

	/* Readstate */
	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	/* Eventdispatcher */
	let _eventdispatcher = new EventTarget()
	let _eventlistener  // agnostic layer .add .remove .show

	/* Engine PATH */
	let _path = {
		document : window.location.href.split('/'),
		script : document.currentScript.src.split('/'),
		root : [],
		engine : ['.'],
		shader : ['engine', 'shader'],
		content : ['content']
	}
	for(let i = 0, len =_path.document.length; i < len; i++) {
		if (_path.script[i] === _path.document[i] ) {
			_path.root.push(_path.document[i])
		} else if (i < _path.document.length-1) {
			_path.engine.push('..')
		}
	}
	_path.engine.push(..._path.script.slice(_path.root.length, _path.script.length-2)) // -2 parent folder is root

	/* Log */ // TODO: make instance for privat scope logs data, set offset to lastindex, improve memory footprint
	const log = {
		infos : true,
		info : function(string) {
			let delta = Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()
			log.view[log.view[0]] = [delta.toString(),'info', log.views.info[0]]
			log.views.info[log.views.info[0]] = string
			// concept 1 
			// - arg logging before updating else cache
			if (log.infos) {
				console.info(
					log.view[log.view[0]][0]+' '+
					log.view[log.view[0]][1]+' '+
					log.views[log.view[log.view[0]][1]][log.views[log.view[log.view[0]][1]][0]]) 
				// console.log(`${delta} \n\t${string}`)
			}

			log.view[0] = (log.view[0] !== log.view.length) ? log.view[0]+1 : 1	
			log.views.info[0] = (log.views.info[0] !== log.views.info.length) ? log.views.info[0]+1 : 1
		},
		events : true,
		event : function(string) {
			let delta = Temporal.Now ? Temporal.Now.plainTimeISO() : new Date().toISOString()
			log.view[log.view[0]] = [delta.toString(),'event', log.views.event[0]]	
			log.views.event[log.views.event[0]] = string

			log.view[0] = (log.view[0] !== log.view.length) ? log.view[0]+1 : 1
			log.views.event[0] = (log.views.event[0] !== log.views.event.length) ? log.views.event[0]+1 : 1
			// conept 2
			// + no declaration logging conflict
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
		}
	}
	/* debug */
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
	/* script loader */
	async function script(path) {
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
	/* core */
	const core = {
		init : async function() {
			log.info(`init core`)
			_eventdispatcher.dispatchEvent(new Event('InitCore'))
			await core.utils.init()

			await script('engine/GUI/controller.js')
			await script('engine/input/controller.js')
			await script('engine/runtime.js')
			if(navigator?.gpu) {
				await script('engine/gpu.js')
			}
			await script('engine/pipeline/controller.js')
			await script('engine/scene/controller.js')			
			await script('engine/utils/math.js') // TODO: .update structure .combine with core utils

			await engine.runtime.init()
		},
		utils : {
			init : async function() {
				engine.utils = new Object
				engine.utils.scr = { // extend wit typebased script loader ?
					load : async(src) => { 
						await new Promise((resolve) => {
							let script = document.createElement('script')
							script.src = src
							script.onload = resolve
							script.onerror = resolve
							document.head.appendChild(script)
						})
					}
				}
			}
		},
	}

	// ======
	// PUBLIC
	// ======

	/* init */   
	// staged for rc0.3.0 or later :: TODO : override on core init for engine instance handling
	const init = (function(){
		log.event(`init engine`)
		let _autoinit = document.currentScript.getAttribute('data-autoinit') ? true : false
		let _event = document.currentScript.getAttribute('data-autoinit') || 'load'
		if (_autoinit &&_event !== 'load' && _event !== 'DOMContentLoaded'){
			console.warn(`data-autoinit event ${_event} not supported.`)
			_event = 'load'
		}
		window.addEventListener(_event, eventlistener)
		/* loadhandler */
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
		root : _path.engine.join('/')+'/engine/',
		shader : _path.shader.join('/')+'/',
		content : _path.content.join('/')+'/',
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
	// IF FEATURESET VAR.FEATURE
	if(_debug != false) {engine.debug = _debug}
	// RETURN VAR
	return engine

})()