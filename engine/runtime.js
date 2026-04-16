/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.runtime = (function () {
	
	// =======
	// PRIVATE
	// =======

	// CONTEXT
	let _descriptor
	let _canvas
	let _context
	let _visibility
	let _scene
	let _view
	// FRAME
	let _frameID

	let _readystate

	// OLD
	let _device = null
	let _format = null

	/* 2252 observer */
	let observer = {
		init : async function() {
			return new Promise(resolve => {
				if (!_canvas) {resolve()}
				let _resize = false
				let _intersect = false
				const resolver = () => {if(_resize && _intersect)resolve()}
				observer.resize = new ResizeObserver(entries => {
					for (const entry of entries) {
						engine.debug?.log(`Canvas ID ${_canvas.findIndex(element => element === entry.target)} size: ${entry.contentRect.width} x ${entry.contentRect.height}`) // DEBUG Datapoints
					} 
					_resize = true
					resolver()
				})
				observer.intersect = new IntersectionObserver(entries => {
					let canvasID
					for(const index in entries) {
						canvasID = _canvas.findIndex(element => element === entries[index].target)
						if(canvasID != -1) {
							engine.debug?.log(`Canvas ID ${canvasID} ${entries[index].isIntersecting ? 'visible' : 'hidden'}`)
							_visibility[canvasID] = entries[index].isIntersecting
						}
					}
					_intersect = true
					resolver()
				})
				_canvas.forEach(element => {
					observer.intersect.observe(element)
					observer.resize.observe(element)
				})
			})
		},
		intersect : null,
		resize : null,
	}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// INIT
		engine.log.event('init runtime')
		engine.eventdispatcher.dispatchEvent(new Event('InitRuntime'))
		// CONTEXT
		_descriptor = new Array
		_canvas = Array.from(document.querySelectorAll('canvas[scene]'))		
		_context = new Array(_canvas.length)
		_visibility = new Array(_canvas.length)
		_scene = new Array(_canvas.length)
		_view = new Array(_canvas.length)

		for(let i = 0, len = _canvas.length; i < len; i++) {
			_scene[i] = _canvas[i].getAttribute('scene')
			_view[i] = _canvas[i].getAttribute('camera')

			let _contextID = _descriptor.findIndex(context => context.scene === _scene[i])
			if(_contextID === -1){
				_descriptor.push({scene: _scene[i], canvas: [i], view: [i]})
			} else {
				_descriptor[_contextID].canvas.push(i)
				_descriptor[_contextID].view.push(i)
			}
		}
		async function loadhandler() {
			// context loader
			if(!_readystate) {
				engine.log.info('runtime init')
				// worker?
				await observer.init()

				await engine.gpu?.init()
				for(let i = 0, len = _canvas.length; i < len; i++) {
					_context[i] = _canvas[i].getContext('webgpu')
					_context[i].configure({
						device: engine.gpu.device,
						format: engine.gpu.format,
						alphaMode: 'premultiplied',
					})
				}
				engine.gpu.context = _context
				engine.runtime.context = _descriptor
				await engine.scene?.init()
				await engine.scene.graph?.init()
			} else {
				console.log('runtime context init')
			}
			// OLD
			_device = engine.gpu.device
			_format = engine.gpu.format
			/*
			await engine.scene.init()			
			for (let index in engine.gpu.context) {
				await engine.scene.load(engine.gpu.context[index].config.scene)
			}
			*/
			/* TODO: rethink scene graph in multiscene support context */
				//await engine.scene.graph.init()
				/* 
					scene info frame (controlled by runtime renderer #second.(framenumber per second or keyframe size))
					scene info delta (controlled by runtime logic #timeline #keyframes)
					scene info buffer (lookup throug index arry?)
						buffer lifetime = gpu.buffer.get(context) buffer throu context? or scene?
					execution:
						get sences by name
							check frame delta
						per dif create buffers and call pipline
				*/

			engine.debug?.timer.start('pass init')
			/* TODO: make it data driven and context dependend instead of 'giving' context,
					may move to  core.js > pipeline init (dose not exist yet) 
					batch switch 
						per pipline # synced framerequest 
						per context # individual framerequest
					*/
				await engine.pipeline.depthpass.init(_device, _context[0])
				await engine.pipeline.basepass.init(_device, _context[0])
				await engine.pipeline.shadowpass.init(_device, _context[0])
				await engine.pipeline.lightpass.init(_device, _context[0])
				await engine.pipeline.composepass.init(_device, _context[0])

			engine.debug?.timer.end('pass init')

			/* TODO: add 'frame bindings' init call method,
					for privatscope DOM update scheduling */

			requestAnimationFrame(frame)
		}
		return loadhandler
	})()



	function frame() {
		engine.STATS.frametime = performance.now() - engine.STATS.delta
		engine.STATS.delta = performance.now()

		const encoder = _device.createCommandEncoder()
		// Defered Drawcalls
		engine.pipeline.depthpass.draw(_device, _context[0])
		engine.pipeline.basepass.draw(encoder)
		engine.pipeline.shadowpass.draw(encoder)
		engine.pipeline.lightpass.draw(encoder)
		engine.pipeline.composepass.draw(encoder, _context[0])

		_device.queue.submit([encoder.finish()])

		_frameID = requestAnimationFrame(frame)
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let runtime = {init}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return runtime
})()