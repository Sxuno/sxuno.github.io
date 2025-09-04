/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.shadowpass = (function () {
    let _buffer = null

    async function init(device, context) {
        _buffer = {}
        _buffer.metadata = engine.pipeline.basepass.buffer.get().metadata      
        _buffer.lights = engine.gpu.buffer.light.create(engine.scene.graph.raw().lights)
    }
    const buffer = { get() { return _buffer }}

    function draw(encoder) {
        
    }

    return { init, draw, buffer}
})()