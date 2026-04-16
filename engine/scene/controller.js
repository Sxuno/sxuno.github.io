/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.scene = (function() {

    // =======
	// PRIVATE
	// =======

    let _metadata
    let _priority
    let _presistant
    let _data

    let _readystate

    async function load(src) {
        await new Promise((resolve) => {
            let script = document.createElement('script')
            script.src = src
            script.onload = resolve
            script.onerror = resolve
            document.head.appendChild(script)
        })
    }
    async function info() {
        await load(engine.PATH.content+'/info.js')
        //console.log(engine.scene.info)
    }
    async function files(){ // TODO: // .branch experimental :: .optimize logic namespaces .extend priority presistent
        for(let i = 0, len = engine.runtime.context.length; i < len; i++) {
            let scene = engine.runtime.context[i].scene
            let infoID = engine.scene.info.findIndex(element => element.name === scene)
            if (infoID !== -1) {
                engine.debug.timer.start(`scene ${scene}`)
                for(let j = 0, len = engine.scene.info[infoID].files.length; j < len; j++) {
                    await load(engine.PATH.content+'/'+engine.scene.info[infoID].files[j]+'.js')
                    // scene data
                    engine.scene.data[engine.scene.cache.object] = engine.scene.data[engine.scene.cache.object] || []
                    if(!engine.scene.data[engine.scene.cache.object].some(entry => entry.name === engine.scene.cache.name)) {
                        engine.scene.data[engine.scene.cache.object].push(engine.scene.cache)
                    }
                    // scene info content
                    engine.scene.info[infoID].content = engine.scene.info[infoID].content || []
                    engine.scene.info[infoID].content[engine.scene.cache.object] = engine.scene.info[infoID].content[engine.scene.cache.object] || []
                    engine.scene.info[infoID].content[engine.scene.cache.object].push({
                        'id': engine.scene.data[engine.scene.cache.object].findIndex(entry => entry.name === engine.scene.cache.name),
                        'name': engine.scene.cache.name,
                    })
                }
                engine.debug.timer.end(`scene ${scene}`)
            } else {
                engine.log.warn(`scene ${scene} not found.`)
            }
        }
        delete engine.scene.cache
    }

    // ======
	// PUBLIC
	// ======

    const init = (function() {
        // init dependency
        engine.log.event('init scene')
        engine.eventdispatcher.dispatchEvent(new Event('InitScene'))

        async function loadhandler() {
            // context loader
            if(!_readystate) {
                engine.log.event('scene init')
                // scene info // Change to metadata .add priority .preload image .presistant
                engine.debug.timer.start('scene info')
                engine.scene.info = new Array
                await info()
                engine.debug.timer.end('scene info')
                // scene data
                engine.scene.data = new Object
                await files()
                // scene graph
                // engine.scene.graph?.init()

                _readystate = true
            } else {

            }
        }
        return loadhandler
    })()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
    let scene = {init}
	// CONDITIONAL
	// RETURN VAR
    return scene
})()