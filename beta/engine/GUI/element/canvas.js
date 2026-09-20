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

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _index
	let _elements
	let _parents
	let _attributes
	let _style

	// WORKER // engine.cpu.worker ??? may 

	const type = {
		context2D : {},
		webgpu : {}
	}

	// ======
	// PUBLIC
	// ======

	class Canvas {} // Note: use to deconstruct only

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init canvas')
		engine.eventdispatcher.dispatchEvent(new Event('InitCanvas'))
		async function loadhandler(input){
			// LOADHANDLER
			if (_readystate) {
				// RUNTIMEHOOK
			} else {
				// CONFIGURATIOIN
				_readystate = true
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
		prototype : Canvas,
	}
	// CONDITIONAL
	// RETURN VAR
	return canvas

})()