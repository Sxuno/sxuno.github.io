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

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _index
	let _elements
	let _parents
	let _attributes
	let _style

	let _override
    
	const type = {
		flexbox : {},
		sizebox : {},
		scrollbox : {}
	}

	// ======
	// PUBLIC
	// ======

	class Section {}

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init section')
		engine.eventdispatcher.dispatchEvent(new Event('InitSection'))
		async function loadhandler(type){
			// LOADHANDLER
			if (!_readystate) {
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
	let section = {
		init: init,
		prototype: Section
	}
	// CONDITIONAL
	// RETURN VAR
	return section

})()