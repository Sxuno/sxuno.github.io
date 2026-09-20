/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine.scene = (function() {

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _metadata
	let _priority
	let _presistant
	let _data // unused?

	async function info() {
		await engine.utils.scr.load('content/info.js')
	}
	async function data(){ // TODO: // .branch experimental :: .optimize logic namespaces .extend priority presistent
		for(let i = 0, len = engine.runtime.descriptor().length; i < len; i++) {
			let scene = engine.runtime.descriptor()[i].scene
			let infoID = engine.scene.info.findIndex(element => element.name === scene)
			if (infoID !== -1) {
				engine.debug?.timer.start(`scene ${scene}`)
				for(let j = 0, len = engine.scene.info[infoID].files.length; j < len; j++) {
					await engine.utils.scr.load('content/'+engine.scene.info[infoID].files[j]+'.js')
					// scene data
					engine.scene.data[engine.scene.cache.object] = engine.scene.data[engine.scene.cache.object] || []
					if(!engine.scene.data[engine.scene.cache.object].some(entry => entry.name === engine.scene.cache.name)) {
						engine.scene.data[engine.scene.cache.object].push(engine.scene.cache)
					}
					// scene info content
					engine.scene.info[infoID].content = engine.scene.info[infoID].content || {}
					engine.scene.info[infoID].content[engine.scene.cache.object] = engine.scene.info[infoID].content[engine.scene.cache.object] || []
					engine.scene.info[infoID].content[engine.scene.cache.object].push({
						'id': engine.scene.data[engine.scene.cache.object].findIndex(entry => entry.name === engine.scene.cache.name),
						'name': engine.scene.cache.name,
					})
				}
				engine.debug?.timer.end(`scene ${scene}`)
			} else {
				engine.log.warn(`scene ${scene} not found.`)
			}
		}
		delete engine.scene.cache
	}

	// ======
	// PUBLIC
	// ======

	class Scene {}

	const init = (function() {
		// DEPENDENCIE
		engine.log.event('init scene')
		engine.eventdispatcher.dispatchEvent(new Event('InitScene'))
		async function loadhandler() {
			// LOADHANDLER
			if(_readystate) {
				// RUNTIME
				engine.log.info('loadhandler scene : runtimehook')
			} else {
				// CONTEXT
				engine.log.info('loadhandler scene : context')
				// scene info // Change to metadata .add priority .preload image .persistant
				engine.debug.timer.start('scene info')
				engine.scene.info = new Array
				await info()
				engine.debug?.timer.end('scene info')
				// scene data
				engine.scene.data = new Object
				await data()
				// scene graph

				await engine.utils.scr.load('engine/scene/graph.js')
				await engine.scene.graph?.init()

				_readystate = true
			}
		}
		return loadhandler
	})()

	const resolver = function(context, data) {
		if(context !== undefined && context !== null) {
			let resolution
			switch (true) {
				case typeof(context) === 'string':
					let index = engine.scene.info.findIndex(element => element.name === context)
					if (index === -1) {
						engine.log.warn(`context ${context} does not exist.`)
						return
					}
					resolution = data[data.findIndex(element => element.scene === context)]
					break
				case typeof(context) === 'number' : 
					resolution = data[context]
					if(!resolution) return
					break
				default: 
					engine.log.warn(`context type ${typeof(context)} not supported.`)
					return
			}
			return resolution
		}
		return data
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let scene = {init, resolver, prototype : Scene}
	// CONDITIONAL
	// RETURN VAR
	return scene
})()