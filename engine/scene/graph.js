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
				for(let i = 0, len = engine.runtime.context.length; i < len; i++) { // TODO: .add autocontentkey declaration
					let count
					_descriptor[i] = new Object

					count = engine.scene.info[i].content.camera.length
					_descriptor[i].camera = new Uint16Array(count)
					for (let c = 0, len = count; c < len; c++) {
					_descriptor[i].camera[c] = engine.scene.info[i].content.camera[c].id
					}
					count = engine.scene.info[i].content.mesh.length
					_descriptor[i].meshes = new Uint16Array(count)
					for (let c = 0, len = count; c < len; c++){
						_descriptor[i].meshes[c] = engine.scene.info[i].content.mesh[c].id
					}
					count = engine.scene.info[i].content.material.length
					_descriptor[i].materials = new Uint16Array(count)
					for (let c = 0, len = count; c < len; c++) {
						_descriptor[i].materials[c] = engine.scene.info[i].content.material[c].id
					}
					count = engine.scene.info[i].content.light.length
					_descriptor[i].lights = new Uint16Array(count)
					for (let c = 0, len = count; c < len; c++) {
						_descriptor[i].lights[c] = engine.scene.info[i].content.light[c].id
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