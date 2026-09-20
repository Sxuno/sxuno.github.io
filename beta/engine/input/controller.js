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
	let _targets
	let _overrides // function flag ? id pointer to function?

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

	// Concept : controller[mouse].dostuff?

	const register = function(input) {
		document.addEventListener()
	}

	const controller = {}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// DEPENDENCIE
		engine.log.event('init input')
		engine.eventdispatcher.dispatchEvent(new Event('InitInputController'))
		async function loadhandler(input){
			// LOADHANDLER
			if (_readystate) {
				// RUNTIMEHOOK
				engine.log.info('loadhandler input : runtimehook')
			} else {
				// CONTEXT
				engine.log.info('loadhandler input : context')
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