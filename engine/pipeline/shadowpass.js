/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.shadowpass = (function () {
    let _buffer = null

    async function init(device, context) {
        _buffer = {}
        _buffer.metadata = engine.pipeline.basepass.buffer.get().metadata


        let hi = 0
        let _scene = engine.scene.graph.raw()
        let _ldata = new Array
        for (let i = 0, len  = _scene[hi].lights.length; i < len; i ++){
            _ldata.push(engine.scene.data.light[_scene[hi].lights[i]])
        }

        _buffer.lights = engine.gpu.buffer.light.create(_ldata)
    }
    const buffer = { get() { return _buffer }}

    function draw(encoder) {
        
    }
    return { init, draw, buffer}
})()