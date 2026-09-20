/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.element.button = (function(){

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _index
	let _elements
	let _parents
	let _attributes
	let _style

	const type = {}

	// ======
	// PUBLIC
	// ======

	class Button {}

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init button')
		engine.eventdispatcher.dispatchEvent(new Event('InitButton'))
		async function loadhandler(type){
			// LOADHANDLER
			if (_readystate) {
				// RUNTIMEHOOK
				if(type) {
					console.log(type)
				}
			} else {
				// CONFIGURATION
				_readystate = true
			}
		}
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let button = {
		init: init,
		prototype : Button
	}
	// CONDITIONAL
	// RETURN VAR
	return button

})()