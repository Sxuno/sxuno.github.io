/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
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
		// init
		engine.log.event('init GUI')
		async function loadhandler(context){
			// context loader  // .add gui config hook
			console.log(engine.GUI)
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

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let GUI = {
		init,
		controller,
		widget
	}
	// CONDITIONAL
	// RETURN VAR
	return GUI
})()