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

	let _loadhandler 
	let _dependencies	
	let _runtimehook 

	let _index
	let _elements
	let _parents
	let _attributes
	let _style

	let _override

	const override = function() {}
	// function hook
	const construct = async function() {}
	//gui.init({[elements], [[attributes]], [parent], [style]})
	const destroy = function() {}
	// gui.destory([{[pointer], [arg], [value]}]) // switch object && array

	const set = function() {}
	// gui.set([{[pointer], [arg], [value]}]) // switch object && array

	const link = function() {}
	const unlink = function() {}
	
	// ======
	// PUBLIC
	// ======

	class Input {} // Note: use to deconstruct only

	const init = (function() {
		// DEPENDENCIE
		engine.log.event('init input')
		// engine.eventdispatcher.dispatchEvent(new Event('InitInput'))
		async function loadhandler(context) {
			// LOADHANDLER
			engine.log.info('loadhandler : GUI element input')
			if(_readystate) {
				// RUNTIMEHOOK
				
			} else {
				// CONFIGURATION
				_readystate = 1
			}
		}
		return loadhandler
	})()
	const style = () => {return _style}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let input = {
		init,
		link,
		unlink,
		destroy,
		prototype : Input
	}
	// CONDITIONAL
	// RETURN VAR
	return input

})()