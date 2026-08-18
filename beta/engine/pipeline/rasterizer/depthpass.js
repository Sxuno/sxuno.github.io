/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.rasterizer = engine.pipeline.rasterizer || {}
engine.pipeline.rasterizer.depthpass = (function () {

	// =======
	// PRIVATE
	// =======

	let _bindgrouplayout
	let _bindgroup
	let _pipelinelayout
	let _pipeline
	let _descriptor
	let _renderTarget

	let _readystate // dependencie solver

	const bind = {'depthpass': 'matrix'}
	const group = {binding: 0 , resource: bind} // scene or camera
	const layout = new Array() // like when visible

	const descriptor = () => {return _descriptor}
	const renderTarget = async (context) => {
		let x = context.width
		let y = context.height
		group.binding = context.buffer // for gpu buffer descriptor
		_descriptor = (!_descriptor)? new Object : _descriptor
		_descriptor = group
		engine.gpu.resource.init(_descriptor)
	}
	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies
		engine.log.event('init rasterizer depthpass')
		//engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// context loader 
			if(!_readystate) {

			} else {
				// runtimehook
				console.warn('rasterizer depthpass init (context)')
				console.log('depthpass init(context)')
				console.log('resource binding')

				context['width'] = (!context.width) ? context.canvas.width : context.width
				context['height'] = (!context.height) ? context.canvas.height : context.height
				console.log('resolution '+context.width+'x'+context.height)
				await renderTarget(context)
				

				//engine.pipeline.buffer(context.buffer)
			}
		}
		return loadhandler
	})()

	const draw = function (scene) {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let depthpass = {init, draw, }
	// CONDITIONAL
	// RETURN VAR
	return depthpass
})()