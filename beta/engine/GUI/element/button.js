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

	let _style
	let _elements

	const type = {}

	// ======
	// PUBLIC
	// ======

	class Button {} // Note: use to deconstruct only

	const init = (function() {
		// init
		engine.log.event('init button')
		engine.eventdispatcher.dispatchEvent(new Event('InitButton'))
		async function loadhandler(type){
			// context loader
			if (!_readystate) {
				_readystate = true
			} else {
				// runtimehook
				if(type) {
					console.log(type)
				}
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
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return button

})()