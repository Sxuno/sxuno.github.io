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

	let _label
	let _size
	let _format
	let _usage

	let _buffer
	let _width
	let _height

	let _readystate

	function create() {
		return engine.gpu.device.createTexture({

		})
	}

	// ======
	// PUBLIC
	// ======

	// Note: compose buffers
	const buffer = {
		zBuffer : {
			create : () => {}
		},
		gbuffer : {
			create : () => {}
		}
	}

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
				//console.log(context.buffer)

				engine.gpu.resource.init(context)

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
	let depthpass = {init, draw, buffer}
	// CONDITIONAL
	// RETURN VAR
	return depthpass
})()