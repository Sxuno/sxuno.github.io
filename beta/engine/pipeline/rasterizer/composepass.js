/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.rasterizer = engine.pipeline.rasterizer || {}
engine.pipeline.rasterizer.composepass = (function () {

	// =======
	// PRIVATE
	// =======

	let _Buffer
	let _width
	let _height

	let _readystate

	const bindindGroup = [{}]

	// ======
	// PUBLIC
	// ======


	const init = (function() {
		// init dependencies
		engine.log.event('init rasterizer composepass')
		//engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// context loader 
			if(!_readystate) {

			} else {
				// runtimehook
				console.warn('rasterizer composepass init (context)')
				console.log(`compose context view ${context.view}`)
			}
		}
		return loadhandler
	})()

	const draw = function (scene) {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let composepass = {init, draw}
	// CONDITIONAL
	// RETURN VAR
	return composepass
})()