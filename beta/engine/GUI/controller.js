/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI = (function() {

	// =======
	// PRIVATE
	// =======

	let _widgets
	let _zIndex

	let _readystate

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies
		engine.log.event('init GUI')
		engine.eventdispatcher.dispatchEvent(new Event('InitGUI'))
		async function loadhandler(context){
			// context loader  // .add gui config hook
			if(!_readystate) {
				_readystate = true
			} else {
				// runtimehook
			}
		}
		return loadhandler
	})()

	const controller = {
		init : (function() {
			// init
			engine.log.event('init GUI controller')
			async function loadhandler(module){
				// context loader // .add gui path hook
			}
			return loadhandler
		})()
	}

	const widget = {
		init : (function() {
			// init
			engine.log.event('init GUI widget')
			async function loadhandler(widget){}
			// context loader
			return loadhandler
		})()
	}

	const element = {
		init : (function() {
			// init
			engine.log.event('init GUI element')
			async function loadhandler(element){}
			// context loader
			return loadhandler
		})()
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let GUI = {
		init,
		element,
		widget
	}
	// CONDITIONAL
	// RETURN VAR
	return GUI
})()