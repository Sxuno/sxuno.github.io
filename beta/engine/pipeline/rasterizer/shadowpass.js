/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.rasterizer.shadowpass = (function () {

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
		engine.log.event('init rasterizer shadowpass')
		// engine.eventdispatcher.dispatchEvent(new Event(''))
        _readystate = true // TEST TOGGLE
		async function loadhandler(context){
			// LOADHANDLER
			if(_readystate) {
				// RUNTIMEHOOK
				console.warn('rasterizer shadowpass init (context)')
			} else {
                // CONFIGURATION
				_readystate = 1
			}
		}
		return loadhandler
	})()

	const draw = function (scene) {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let shadowpass = {init, draw}
	// CONDITIONAL
	// RETURN VAR
	return shadowpass
})()