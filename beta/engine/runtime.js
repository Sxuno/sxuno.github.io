/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.runtime = (function() {

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	// CONTEXT
	let _descriptor
	let _canvas
	let _context
	let _visibility
	let _scene
	let _camera
	let _view

	let _devicePixelRatio
	let _resolutionScale
	let _resolution

	let _frame
	
	/* FLAGS :: CONCEPT

	// SETUP
	let flags = new Uint8Array(1) // allow controller flags[1]?
	let _dependencies 	= 1 // 2^0
	let _loadhandler 	= 2 // 2^1
	let _runtimehook 	= 4 // 2^2

	// SET
	flags[0] |= _dependencies

	// CLEAR
	// flags[0] &= ~_dependencies

	// TOGGLE
	// flags[0] ^= _dependencies

	// if (flags[0] & _dependencies) {
    // flag is set
	// }
	
	*/

	let observer = {
		init : async function() {
			return new Promise(resolve => {
				let _resize = false
				let _intersect = false
				const resolver = () => {if(_resize && _intersect)resolve()}
				observer.resize = new ResizeObserver(entries => {
					for (let i = 0; i < entries.length; i++) {
						let entry = _readystate ? _context.findIndex(element => element === entries[i].target) : _canvas.findIndex(element => element === entries[i].target)
						engine.debug?.log(`Canvas ID ${entry} size: ${entries[i].contentRect.width} x ${entries[i].contentRect.height}`)
					}
					_resize = true
					resolver()
				})
				observer.intersect = new IntersectionObserver(entries => {
					for (let i = 0; i < entries.length; i++) {
						let entry = _readystate ? _context.findIndex(element => element.canvas === entries[i].target) : _canvas.findIndex(element => element === entries[i].target)
						if(entry != -1) {
							engine.debug?.log(`Canvas ID ${entry} ${entries[i].isIntersecting ? 'visible' : 'hidden'}`)
							_visibility[entry] = entries[i].isIntersecting
						}
					}
					_intersect = true
					resolver()
				})
				for(let i = 0, len = _canvas.length; i < len; i++) {
					observer.resize.observe(_canvas[i])
					observer.intersect.observe(_canvas[i])
				}
			})
		},
		intersect : null,
		resize : null,
	}

	function renderloop() {
		let now = performance.now()
		engine.STATS.frametime = now - engine.STATS.delta
		engine.STATS.delta = now
		engine.STATS.fps = 1/(engine.STATS.frametime/1000)

		// DRAWCALLS
		// runtime decides what to draw
		// dispatch worker for scene graph update? 
		for (let i = 0; i < _context.length; i++) {
			if(_visibility[i]) {
				engine.pipeline.render(_context[i])
			}
		}

		engine.STATS.framedelta = performance.now() - engine.STATS.delta
		_frame = requestAnimationFrame(renderloop)
	}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies // TODO .showLoading?
		engine.log.event('init runtime')
		engine.eventdispatcher.dispatchEvent(new Event('InitRuntime'))
		// DESCRIPTOR
		_descriptor = new Array
		_canvas = Array.from(document.querySelectorAll('canvas[scene]'))
		_context = new Array(_canvas.length)
		_visibility = new Array(_canvas.length)
		_scene = new Array(_canvas.length)
		_camera = new Array(_canvas.length) 
		_view = new Array(_canvas.length)
		_renderer = new Array(_canvas.length)

		_devicePixelRatio = window.devicePixelRatio ?? 1
		_resolutionScale = 1

		for(let i = 0, len = _canvas.length; i < len; i++) {
			// RESOLUTION SETUP // TODO : .add engine.config.resolutionscale // allow per scene?
			let css = window.getComputedStyle(_canvas[i])
			_canvas[i].width = (_canvas[i].getBoundingClientRect().width - ((parseFloat(css.borderLeftWidth || 0) + (parseFloat(css.borderRightWidth) || 0))))* _devicePixelRatio * _resolutionScale
			_canvas[i].height = (_canvas[i].getBoundingClientRect().height - ((parseFloat(css.borderTopWidth || 0) + (parseFloat(css.borderBottomWidth) || 0)))) * _devicePixelRatio * _resolutionScale

			_scene[i] = _canvas[i].getAttribute('scene')
			_camera[i] = _canvas[i].getAttribute('camera')
			_renderer[i] = _canvas[i].getAttribute('renderer')
			_view[i] = _canvas[i].getAttribute('view')

			let scene = _descriptor.findIndex(context => context.scene === _scene[i])
			if(scene === -1){
				_descriptor.push({scene: _scene[i], canvas: [i], camera:[_camera[i]], view: [_view[i]]})
			} else {
				_descriptor[scene].canvas.push(i)
				_descriptor[scene].camera.push(_camera[i])			
				_descriptor[scene].view.push(_view[i])
			}
		}
		async function loadhandler(context){
			// loadhandler
			if(!_readystate) {
				engine.log.info('runtime init')
				// context dependencies

				await engine.GUI.init()
				if (engine.debug) {
					await engine.GUI.element.console.init()
				}
				await observer.init()

				await engine.gpu?.init()
				await engine.pipeline?.init()
				await engine.scene?.init()

				// context setup
				engine.log.info('runtime context init')
				if (engine.gpu?.device) {
					engine.debug.timer.start('runtime context')
					let pipeline = engine.pipeline.descriptor() // unused?
					for(let i = 0, len = _canvas.length; i < len; i++) {
						_context[i] = _canvas[i].getContext('webgpu')
						_context[i].configure({
							device: engine.gpu.device,
							format: engine.gpu.format,
							alphaMode: 'premultiplied',
						})
						// Modulate pipeline instructions
						_context[i].index = i
						let scene = _descriptor.findIndex(context => context.scene === _scene[i])
						_context[i].scene = scene
						let camera =  engine.scene.data.camera.findIndex(camera => camera.name === _camera[i])
						if (camera === -1) { camera = engine.scene.data.camera.findIndex(camera => camera.name === engine.scene.info[engine.scene.info.findIndex(scene => scene.name === _scene[i])].camera)}
						_context[i].camera = camera
						let renderer = engine.pipeline.descriptor().findIndex(pipeline => pipeline.renderer === _renderer[i])
						if (renderer === -1) { renderer = 0 }
						_context[i].renderer = renderer

						// DEBUG :: view namespace
						// DEBUG :: pipeline loading
						let view = engine.pipeline.descriptor()[renderer].view().findIndex(entry => entry === _view[i])
						if (view === -1) { view = 0 }
						_context[i].view = view
					}
					engine.debug?.timer.end('runtime context')
				}
				// TODO: for each visible context engine.pipeline.init(_context)
				// await engine.pipeline.context.init() 
				await engine.pipeline.init(_context)

				/* DEBUG
				console.log('RUNTIME CONTEXT')
				console.log(engine.runtime.context())
				console.log('RUNTIME DESCRIPTOR')
				console.log(engine.runtime.descriptor())
				console.log('SCENE GRAPH DESCRIPTOR')
				console.log(engine.scene.graph.descriptor())
				console.log('SCENE DATA')
				console.log(engine.scene.data)
				*/
				_readystate = true
				requestAnimationFrame(renderloop)
			} else {
				// runtimehook
			}		
		} 
		return loadhandler
	})()

	const context = function() {
		return _context
	}

	const descriptor = function(context) { 
		return engine.scene.resolver(context, _descriptor)
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let runtime = {init, descriptor, context}
	// CONDITIONAL
	// RETURN VAR
	return runtime

})()