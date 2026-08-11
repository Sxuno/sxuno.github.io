/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.input = engine.input || {}
engine.input.controller = (function(){

	// =======
	// PRIVATE
	// =======
	let _keyevents

	let _readystate

	const keyevent = {
		register : () => {},
		remove : () => {}
	}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init
		engine.log.event('init input controller')
		engine.eventdispatcher.dispatchEvent(new Event('InitInputController'))
		async function loadhandler(input){
			// context loader
			if (!_readystate) {
				_readystate = true
			} else {
				// runtimehook
			}
		}
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let controller = {
		init: init,
		mode : 'orbital',
		pointerlock : false,
		cursor : true,
		listener : 'click'
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return controller

})()