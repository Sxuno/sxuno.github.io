/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.element.console = (function(){
	
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
	let _style // .console {} #{prefix}-Console (config.style.prefix) // or structure tracking

	let _override

	const override = function() {
		// CONCEPT
		// let _override.engine.log.event
		// engine.log.event = function(...args) {
		//		element.section.set([{pointer, [arg], [value]}])
		// 		_override.apply(engine.log, args)
		//	return
		// }
	}

	const construct = async function() {}
	//gui.init({[elements], [[attributes]], [parent], [style]})
	const destroy = function() {}
	// gui.destory([{[pointer], [arg], [value]}]) // switch object && array

	const set = function() {}
	// set([{[pointer], [arg], [value]}]) // switch object && array

	const link = function() {}
	const unlink = function() {}

	// ======
	// PUBLIC
	// ======

	class Console {}

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init console')
		
		async function loadhandler(context) {
			// LOADHANDLER
			if(_readystate) {
				// RUNTIMEHOOK
				engine.log.info('loadhandler console : runtimehook')
			} else {
				// CONFIGURATION
				engine.log.info('loadhandler console : context')
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
	let console = {
		init,
		link,
		unlink,
		destroy,
		prototype : Console
	}
	// CONDITIONAL
	// RETURN VAR
	return console
})()