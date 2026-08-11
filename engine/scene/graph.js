/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.scene.graph = (function() {
    
	// =======
	// PRIVATE
	// =======
	
	// CONTEXT
	let _descriptor
	let _data

	let _readystate

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependency
		engine.log.event('init scene graph')

		async function loadhandler(graph){
			// context loader
			if(!_readystate) {
				engine.log.event(`scene grahp init`)

				engine.debug.timer.start('scene graph content')
				_descriptor = new Array 
				for(let i = 0, len = engine.runtime.context.length; i < len; i++) {
					_descriptor[i] = new Object
					let id = engine.scene.info.findIndex(scene => scene.name === engine.runtime.context[i].scene)
					for (let group in engine.scene.info[id].content) {
						let entries = engine.scene.info[id].content[group].length
						_descriptor[i][group] = new Uint16Array(entries)
						for (let e = 0; e < entries; e++) {
							_descriptor[i][group][e] = engine.scene.info[id].content[group][e].id
						}
					}
				}
				engine.debug.timer.end('scene graph content')
				_readystate = true
			}
		}		
		return loadhandler
	})()

	function raw() { return _descriptor }

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let graph = {init, raw}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return graph

})()