/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline = (function() {

	// =======
	// PRIVATE
	// =======

	let _descriptor
	let _renderer // reserved only
	let _pointer
	let _buffer

	let _readystate

	// #1 - redundency tracker
	async function load(src) {
		await new Promise((resolve) => {
			let script = document.createElement('script')
			script.src = src
			script.onload = resolve
			script.onerror = resolve
			document.head.appendChild(script)
		})
	}

	// RENDERER
	// NOTE : renderer imidiate invoke || execution at controller init
	const renderer = {
		rasterizer :  (function (){

			let _readystate
			
			let _view = [
				'lit',
				'unlit',
				'depth'
			]
			let _passes = [/*order = execution*/
				[/*lit*/
					'rasterizer/depthpass',
					'rasterizer/basepass',
					'rasterizer/lightpass',
					'rasterizer/shadowpass',
					'rasterizer/composepass',
				],
				[/*unlit*/
					'rasterizer/depthpass',
					'rasterizer/geometrypass',
					'rasterizer/composepass',
				],
				[/*depth*/
					'rasterizer/depthpass',
					'rasterizer/geometrypass',
					'rasterizer/composepass',
				],
			]
			const init = async function (context) {
				if(!_readystate) {
					engine.log.event('rasterizer init')
					engine.eventdispatcher.dispatchEvent(new Event('InitRasterizer'))
					engine.pipeline.rasterizer ?? new Object
					_readystate = true
				}
				if(typeof(context) === 'object' && !Array.isArray(context)) {
					engine.log.event('rasterizer init (context:view)')
					engine.debug?.log(`view ${controller[context.renderer].view()[context.view]}`)
					await controller[context.renderer].passes(context.view)

					for (let i = 0; i < _passes[context.view].length; i++) {
						// move to passes
						let namespace = _passes[context.view][i].split('/')
						await engine.pipeline[namespace[0]][namespace[1]].init(context)
					}
				}
			}
			const buffer = {struct: { texture : []}}
			const draw = function (context) {
				// DEBUG
				// console.log('rasterizer')
				// console.log(_buffer[context.scene][1][context.camera][1][context.renderer][1][context.view][1])
			}
			 const passes = async function(view) {
				// NOTE : Loop === placeholder : init batch
				// on error -> switch ? renderer[0] : view 
				for (let i = 0; i < _passes[view].length; i++) {

					let namespace = _passes[view][i].split('/')

					if(typeof(engine.pipeline[namespace[0]]) === 'undefined'){
						let _pass = _descriptor.findIndex(type => type.renderer === namespace[0])
						if (_pass === -1) {
							engine.debug.war(`pipeline controller for renderer ${namespace[0]} missing`)
							engine.log.event(`pipeline init ${namespace[0]}`)
							engine.pipeline[namespace[0]] ?? new Object
						} 
						if (_pass !== -1) {
							controller[_descriptor.findIndex(type => type.renderer === namespace[0])].init()
						}						
						engine.debug.log(`register ${[namespace[0]]} ${[namespace[1]]}`)
						await load(engine.PATH.root+`pipeline/${_passes[view][i]}.js`)
					}
					if(typeof(engine.pipeline[namespace[0]][namespace[1]]) === 'undefined'){
						engine.debug.log(`register ${[namespace[0]]} ${[namespace[1]]}`)
						await load(engine.PATH.root+`pipeline/${_passes[view][i]}.js`) 
						// TODO: switch = imidiate await || batch await after init complete
						// DEBUG pass namespaces here
					}
				}
			}
			const view = () => {return _view}
			
			let rasterizer = {
				init,
				draw,
				view,
				passes
			}
			return rasterizer
		})(),
		raytracer : (function() {

			let _readystate

			let _view = [
				'lit',
				'unlit',
				'depth'
			]
			let _passes = [/*order = execution*/
				[/*lit*/
					'raytracer/basepass',
					'rasterizer/composepass',
				],
				[/*unlit*/
					'raytracer/basepass',
					'rasterizer/composepass',
				],
				[/*depth*/
					'raytracer/basepass',
					'rasterizer/composepass',
				],
			]

			const init = async function (context) {
				if(!_readystate) {
				engine.log.event('init raytracer')
				engine.eventdispatcher.dispatchEvent(new Event('InitRaytracer'))
				engine.pipeline.raytracer ?? new Object
				_readystate = true}

				if(typeof(context) === 'object' && !Array.isArray(context)) {
					engine.log.event('raytracer init (context:view)')
					engine.debug?.log(`view ${controller[context.renderer].view()[context.view]}`)
					await controller[context.renderer].passes(context.view)

					for (let i = 0; i < _passes[context.view].length; i++) {
						// move to passes
						let namespace = _passes[context.view][i].split('/')
						await engine.pipeline[namespace[0]][namespace[1]].init(context)
					}
				}
			}
			const draw = function (context) {
				// console.log('raytracer')
			}
			const passes = async function(view) {
				// NOTE : Loop === placeholder : init batch
				// on error -> switch ? renderer[0] : view 
				for (let i = 0; i < _passes[view].length; i++) {

					let namespace = _passes[view][i].split('/')

					
						let _pass = _descriptor.findIndex(type => type.renderer === namespace[0])
						if (_pass === -1) {
							engine.debug.war(`pipeline controller for renderer ${namespace[0]} missing`)
							engine.log.event(`pipeline init ${namespace[0]}`)
							engine.pipeline[namespace[0]] ?? new Object
						} 
						if (_pass !== -1) {
							controller[_descriptor.findIndex(type => type.renderer === namespace[0])].init()
						}						
						engine.debug.log(`register ${[namespace[0]]} ${[namespace[1]]}`)
						await load(engine.PATH.root+`pipeline/${_passes[view][i]}.js`)
					
					if(typeof(engine.pipeline[namespace[0]][namespace[1]]) === 'undefined'){
						engine.debug.log(`register ${[namespace[0]]} ${[namespace[1]]}`)
						await load(engine.PATH.root+`pipeline/${_passes[view][i]}.js`)
						// TODO: swtich = imidiate await || batch await after init complete
						// DEBUG pass namespaces here
					}
				}
			}
			const view = () => {return _view}

			const raytracer = {
				init,
				draw,
				view,
				passes,
			}
			return raytracer
		})(),
		pathtracer : (function () {
			let _view = ['lit']
			let _passes = null

			const init = async function () {
				if(!_readystate) {
				engine.log.event('init pathtracer')	
				engine.eventdispatcher.dispatchEvent(new Event('InitPathtracer'))}
			}
			const draw = function (context) {
				console.log('pathtracer')
			}
			const view = () => {return _view}

			return {init, draw, view}
		})(),
		datatracer : (function() {
			let _view = [
				'lit',
			]
			let _passes

			const init = async function() {
				if(!_readystate) {
				engine.log.event('init datatracer')
				engine.eventdispatcher.dispatchEvent(new Event('InitDatatracer'))}
			}
			const draw = function(context) {
				console.log('datatracer')
			}
			const view = () => {return _view}

			let datatracer = {
				init,
				draw, 
				view,
			}
			return datatracer
		})()
	}

	const controller = new Array

	const descriptor = () => {return _descriptor}

	const pointer = {
		init : async (context) => {
			// console.log(context)
			// complexitiy :: scene x camera x renderer x view = buffer(context) :: if invalid init(context)	
			let _context = engine.runtime.context()

			// BUFFER ACCESS STRUCTURE
			// scene x camera x renderer x view = bufferobject
			// Note : 
			// 			index 0  = global ids 
			//			index 1 = Access path
			//
			// 			RINGBUFFER OFFSET POSSIBLE

			// micro optimization: 
			// 		replace .findIndex with manual loop
			// 		replaces function call overhand with inline execution,
			// 		can prevent garbage collection churn from V8/SpiderMonkey (browser)

			for (let i = 0 ; i < _context.length; i++) {
				if (!_pointer) {
					engine.log.event(`buffer init`)
					_pointer = new Array()		
				}
				engine.log.event(`register buffer context ${i}`)
				let s = null
				let c = 0
				let r = 0
				let v = 0 
				let b = 0
				
				s = _pointer.findIndex(scene => scene[0] === _context[i].scene)

				if(s === -1) {
					_pointer.push([_context[i].scene, []])
					engine.debug?.log(`link scene [${_context[i].scene}] to buffer [${_pointer.length-1}]`)	
					s = _pointer.findIndex(scene => scene[0] === _context[i].scene)
				} 
				
				c = _pointer[s][1].findIndex(camera => camera[0] === _context[i].camera)

				if(c === -1) {
					_pointer[s][1].push([_context[i].camera, []])
					engine.debug?.log(`link camera [${_context[i].camera}] to buffer [${s}]`)
					c = _pointer[s][1].findIndex(camera => camera[0] === _context[i].camera)
				}
			
				r = _pointer[s][1][c][1].findIndex(renderer => renderer[0] === _context[i].renderer)

				if(r === -1) {
					_pointer[s][1][c][1].push([_context[i].renderer, []])
					engine.debug?.log(`link renderer [${_context[i].renderer}] to buffer [${s}]`)
					r = _pointer[s][1][c][1].findIndex(renderer => renderer[0] === _context[i].renderer)
				}

				// renderer init context
				// REMOVED VIEW from POINTER => USE BUFFER STRUCT with view as composepass arg
				_context[i].buffer = [s,c,r] 
				await controller[_context[i].renderer].init(_context[i])
				// TODO : BUFFER OBJECT				
			}
			// engine.debug?.log('pointer', _pointer)
			 engine.debug?.log('buffer pointer', _pointer)
		}
	}
	// BUFFER
	// CONTEXT :: pipeline context buffer
	const context = {
		init : async (buffer) => {
			engine.log.event('pipeline context init')
			console.log(buffer)
		}
	}	
	const buffer = (binding, resource) => {
		if (typeof(resource) === 'undefined' && typeof(binding) === 'undefined'){
			return _buffer
		} else {
			if (typeof(resource === 'number') && typeof(binding) === 'object' && Array.isArray(binding)) {
			console.log(`buffer ${resource}`)
			_pointer[binding[0]][1][binding[1]][1][binding[2]][1] = resource
			// console.log(_pointer[binding[0]][1][binding[1]][1][binding[2]][1])
			}	
		}
	}
	
	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies
		engine.log.event('init pipeline')
		engine.eventdispatcher.dispatchEvent(new Event('InitPipeline'))

		_descriptor = new Array()

		async function loadhandler(context) {
			// context loader
			if(!_readystate) {
				engine.log.event('pipeline init')
			
				for (let type of Object.keys(renderer)) {
					controller.push(renderer[type])
					_descriptor.push({renderer : type, view : renderer[type].view})
				}
				// TODO: engine.config.renderer
				_readystate = true
			} else {
				// runtimehook
				
				pointer.init(context)
			}
		}
		return loadhandler
	})()

	const render = function (context) {
		controller[context.renderer].draw(context)
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let pipeline = {init, buffer, context, render, descriptor}
	// CONDITIONAL
	// RETURN VAR
	return pipeline
})()