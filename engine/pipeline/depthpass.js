/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.depthpass = (function () {
    let _ZBuffer
    let _width 
    let _height 

    function _createZBuffer(device, width, height) {
        return device.createTexture({
            label: 'depth texture',
            size: [width, height, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        })
    }
    async function init(device, context) {
        _ZBuffer = new Array(engine.scene.graph.descriptor().length)
        _width = new Array(engine.scene.graph.descriptor().length)
        _height = new Array(engine.scene.graph.descriptor().length)
        for (let i = 0; i < engine.scene.graph.descriptor().length; i++ ) {
            _width[i] = context[i].canvas.width
            _height[i] = context[i].canvas.height
            _ZBuffer[i] = _createZBuffer(device, _width[i], _height[i])
        }
    }
    const buffer = { get() { return _ZBuffer } }
    function draw(device, context) {
        let width = context.canvas.width
        let height = context.canvas.height
        if (width !== _width[context.scene] || height !== _height[context.scene]) {
            _width[context.scene] = width
            _height[context.scene] = height
            _ZBuffer[context.scene].destroy?.()
            _ZBuffer[context.scene] = _createZBuffer(device, _width[context.scene], _height[context.scene])
        }
    }
    return { init, draw, buffer }
})()