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

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 
	
	// PIPELINE
	let _binding
	let _bindGroupLayout
	let _bindGroup
	let _pipelineLayout
	let _pipeline

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init raytracer basepass')
		//engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// loadhandler
			if(_readystate) {
				// RUNTIMEHOOK
			} else {
				// CONFIGURATION
				_readystate = 1
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