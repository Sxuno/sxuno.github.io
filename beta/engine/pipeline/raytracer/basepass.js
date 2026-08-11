/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.raytracer = engine.pipeline.raytracer || {}
engine.pipeline.raytracer.basepass = (function () {

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

	//async function init() {}

	const init = (function() {
		// init dependencies
		engine.log.event('init raytracer basepass')
		//engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// context loader 
			if(!_readystate) {
				
			} else {
				// Runtime hook
				console.warn('raytracer basepass init (context)')
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