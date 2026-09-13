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
	let _style

	let _override

	const override = function() {
		// concept

		// let _hook.engine.log.event
		// engine.log.event = function(...args) {
		//		element.section.set([{pointer, [arg], [value]}])
		// 		_hook.apply(engine.log, args)
		//	return
		// }
	}

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

	class Console {}

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('GUI console init')
		
		async function loadhandler(context) {
			// LOADHANDLER
			engine.log.info('loadhandler : GUI Console')
			if(!_readystate) {
				
				_readystate = 1
			} else {
			// RUNTIMEHOOK
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