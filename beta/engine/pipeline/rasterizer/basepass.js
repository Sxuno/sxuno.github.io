/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.rasterizer = engine.pipeline.rasterizer || {}
engine.pipeline.rasterizer.basepass = (function () {

	// =======
	// PRIVATE
	// =======

	let _Buffer
	let _width
	let _height

	let _readystate

	// ======
	// PUBLIC
	// ======


	// concept basepass creates metadata and links

	// SCENE GRAPH
	// view projection matrix
	// light num 
	
	// CANVAS
	// size
	// color
	// alpha

	// cpu side : bindgroup []
	// for each => bindgroup
	// scene.graph.init(context)
	// gpu[bindgroup].buffer(context)

	//async function init() {}

	const init = (function() {
		// init dependencies
		engine.log.event('init rasterizer basepass')
		//engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// context loader 
			if(!_readystate) {
				
			} else {
				// Runtime hook
				console.warn('rasterizer basepass init (context)')
				//console.log(engine.pipeline.buffer()[context.buffer[0]][1][context.buffer[1]][1][context.buffer[2]][1][context.buffer[3]][1])
				let rendertarget = null
				let buffer = {texture : {depth: rendertarget}}
				//engine.pipeline.context.init(buffer)


				let t = {
					label: 'Composepass',
					layout: '_pipeline.getBindGroupLayout(0)',
					entries: [
						{ binding: 0, resource: 'engine.gpu.binding.sampleTexture(nearest)'},
						{ binding: 1, resource: 'engine.pipeline.basepass.buffer.get().albedo '},
						{ binding: 2, resource: 'engine.pipeline.lightpass.buffer.get().createView({label: composepass bindgroup resource[2]: lightpass buffer view})' },
						{ binding: 3, resource: '{buffer: engine.pipeline.basepass.buffer.get().metadata}' }
					]
				}
				console.log(t)

			}
		}
		return loadhandler
	})()

	const draw = function (scene) {
		engine.log.event('init basepass')
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let basepass = {init, draw}
	// CONDITIONAL
	// RETURN VAR
	return basepass
})()