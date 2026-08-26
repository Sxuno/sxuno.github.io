/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.element.canvas = (function(){

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
		engine.log.event('init canvas')
		engine.eventdispatcher.dispatchEvent(new Event('InitCanvas'))
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
	let canvas = {
		init: init,
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return canvas

})()