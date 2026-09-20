/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.element.image = (function(){

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
		static : {},
		slideshow : {},
		background : {}
	}
	
	// ======
	// PUBLIC
	// ======

	class Image {} // Note: use to deconstruct only

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init image')
		engine.eventdispatcher.dispatchEvent(new Event('InitImage'))
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
	let image = {
		init: init,
		prototype : Image
	}
	// CONDITIONAL
	// RETURN VAR
	return image

})()