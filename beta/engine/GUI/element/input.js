/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.element.input = (function(){

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _style
	let _elements

	const type = {
		promt : {
			init : () => {},
			submit : () => {}
		},
		file : {}
	}

	// ======
	// PUBLIC
	// ======

	class Input {} // Note: use to deconstruct only

	const init = (function() {
		// init
		engine.log.event('init input')
		engine.eventdispatcher.dispatchEvent(new Event('InitInput'))
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
	let input = {
		init: init,
		prototype : Input
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return input

})()