/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.shadowpass = (function () {
    let _buffer = null

    async function init(device, context) {    
        let _scene = engine.scene.graph.descriptor()
        let _ldata = new Array(_scene.length)

         _buffer = new Array(_scene.length)

        for (let i = 0; i < _scene.length; i++) {
            _buffer[i] = new Object
            _buffer[i].metadata = engine.pipeline.basepass.buffer.get()[i].metadata

            for (let s = 0 ; s < _scene[i].light.length; s ++) {
                _ldata[i] = new Array
                _ldata[i].push(engine.scene.data.light[_scene[i].light[s]])
            }
            _buffer[i].lights = engine.gpu.buffer.light.create(_ldata[i])
        }
    }
    const buffer = { get() { return _buffer }}

    function draw(encoder) {
        
    }
    return { init, draw, buffer}
})()