/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.scene.graph = (function(){
    
	// =======
	// PRIVATE
	// =======
	
	let _descriptor
	let _data
	let _opsqeue // for later

	let _readystate

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependency
		engine.log.event('init scene graph')
		engine.eventdispatcher.dispatchEvent(new Event('InitSceneGraph'))
		async function loadhandler(context){
			// context loader
			if(!_readystate) {
				engine.log.event(`scene graph init`)

				engine.debug?.timer.start('scene graph descriptor')
				_descriptor = new Array 
				for(let i = 0, len = engine.runtime.descriptor().length; i < len; i++) {
					_descriptor[i] = new Object
					let id = engine.scene.info.findIndex(scene => scene.name === engine.runtime.descriptor()[i].scene)
					for (let group in engine.scene.info[id].content) {
						let entries = engine.scene.info[id].content[group].length
						_descriptor[i][group] = new Uint16Array(entries)
						for (let e = 0; e < entries; e++) {
							_descriptor[i][group][e] = engine.scene.info[id].content[group][e].id
						}
					}
				}
				engine.debug?.timer.end('scene graph descriptor')

				_readystate = true
			} else {
				// runtimehook
			}
		}		
		return loadhandler
	})()

	const data = function(context) {
		return engine.scene.resolver(context, _data)
	}

	const descriptor = function(context) {
		return engine.scene.resolver(context, _descriptor)
	}

	// ======
	// EXPORT
	// ======

	// NAMESPACE VAR
	let graph = {
		init,
		data,
		descriptor
	}
	// CONDITIONAL
	// RETURN VAR
	return graph

})()