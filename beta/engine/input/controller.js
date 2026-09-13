/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.input = (function(){

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _events
	let _hooks

	// events
	// ---

		// gesture
		// sensor
		// keyboard
		// mouse
		// microphone
		// camera

	// APIS
	// ---

	// MediaDevicesAPI

	// Pointer Events API
	// Touch Events API
	// Gamepad API
	// Keyboard API

	// Device OrintationEvent
	// DeviceMotionEvent

	const register = function(input) {
		document.addEventListener()
	}

	const controller = {}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// dependencies
		engine.log.event('init input controller')
		engine.eventdispatcher.dispatchEvent(new Event('InitInputController'))
		async function loadhandler(input){
			// loadhandler
			if (_readystate) {
				// runtimehook
				
			} else {
				// context init
				_readystate = 1
			}
		}
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let input = {
		init: init,
		mode : 'orbital',
		pointerlock : false,
		cursor : true,
		listener : 'click'
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return input

})()