/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.rasterizer = engine.pipeline.rasterizer || {}
engine.pipeline.rasterizer.lightpass = (function () {

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

	const init = (function() {
		// init dependencies
		engine.log.event('init rasterizer lightpass')
		//engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// context loader  // .add gui config hook
			if(!_readystate) {

			} else {
				// runtimehook
				console.warn('rasterizer lightpass init (context)')
			}
		}
		return loadhandler
	})()

	const draw = function (scene) {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let lightpass = {init, draw}
	// CONDITIONAL
	// RETURN VAR
	return lightpass
})()