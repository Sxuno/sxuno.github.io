/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.depthpass = (function () {
    let _ZBuffer
    let _width = 0
    let _height = 0

    function _createZBuffer(device, width, height) {
        return device.createTexture({
            label: 'depth texture',
            size: [width, height, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        })
    }
    async function init(device, context) {
        _width = context.canvas.width
        _height = context.canvas.height
        _ZBuffer = _createZBuffer(device, _width, _height)
    }
    const buffer = { get() { return _ZBuffer } }
    function draw(device, context) {
        const width = context.canvas.width
        const height = context.canvas.height
        if (width !== _width || height !== _height) {
            _width = width
            _height = height
            _ZBuffer.destroy?.()
            _ZBuffer = _createZBuffer(device, _width, _height)
        }
    }
    return { init, draw, buffer,  }
})()