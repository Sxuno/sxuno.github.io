/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.GUI = engine.GUI || {}
engine.GUI.controller = (function(){
	
	// =======
	// PRIVATE
	// =======
	
	let _readystate

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init
		engine.log.info('init GUI controller')
		async function loadhandler(GUI){}
		// context loader
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let controller = {
		init: init,
		mode : 'orbital',
		pointerlock : false,
		cursor : true,
		listener : 'click'
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return controller

})()