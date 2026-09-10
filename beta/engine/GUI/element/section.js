/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.element.section = (function(){

	// =======
	// PRIVATE
	// =======

	let _readystate

	class Section {} // Note: use to deconstruct only
    
	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init
		engine.log.event('init section')
		engine.eventdispatcher.dispatchEvent(new Event('InitSection'))
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
	let section = {
		init: init,
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return section

})()