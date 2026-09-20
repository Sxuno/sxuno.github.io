/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.utils.performance = engine.utils.performance || new Object
engine.utils.performance.profiler = (function(){

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// DEPENDENCIE
		engine.log.event('init profiler')
		// engine.eventdispatcher.dispatchEvent(new Event('Initprofiler'))
		async function loadhandler(input){
			// LOADHANDLER
			if (_readystate) {
				// RUNTIMEHOOK
				engine.log.info('loadhandler profiler : runtimehook')
			} else {
				// CONTEXT
				engine.log.info('loadhandler profiler : context')
				_readystate = 1
			}
		}
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let profiler = {
		init: init,
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return profiler

})()