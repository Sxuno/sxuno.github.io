/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.lightpass = (function () {
    let _pipeline = null
    let _bindGroup = null
    let _descriptor = null
    let _renderTarget = null

    async function init(device, context) {
        _pipeline = device.createRenderPipeline({
            label: 'Lightpass',
            layout: 'auto',
            vertex: {
                module: device.createShaderModule({
                    label: 'shared vertex strip quad',
                    code: engine.shader.shared.vertex.strip.quad
                }),
                entryPoint: 'main'
            },
            fragment: {
                module: device.createShaderModule({
                    label: 'fragment',
                    code: engine.shader.lights.fragment
                }),
                entryPoint: 'main',
                targets: [{ format: 'rgba16float' }]
            },
            primitive: { topology: 'triangle-strip' }
        })
        _bindGroup = device.createBindGroup({
            label: 'Lightpass',
            layout: _pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: engine.pipeline.basepass.buffer.get().albedo },
                { binding: 1, resource: engine.pipeline.depthpass.buffer.get().createView({label: 'lightpass bindgroup view zBuffer'}) },
                { binding: 2, resource: engine.gpu.binding.sampleTexture()},
                { binding: 3, resource: { buffer: engine.pipeline.shadowpass.buffer.get().lights }},
                { binding: 4, resource: { buffer: engine.pipeline.shadowpass.buffer.get().metadata }}
            ]
        })
        _renderTarget = device.createTexture({
            label: 'lightpass _renderTarget',
            size: [context.canvas.width, context.canvas.height],
            format: 'rgba16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        })
        _descriptor = {
            colorAttachments: [
                {
                    view: _renderTarget.createView({label: 'lightpass descriptor view renderTarget'}),
                    loadOp: 'clear',
                    storeOp: 'store',
                    clearValue: { r: 0, g: 0, b: 0, a: 0 }
                }

            ]
        }
    }
    const buffer = { get() { return _renderTarget}}
    function draw(encoder) {
        // pointer based method (low-level)
        const passEncoder = encoder.beginRenderPass(_descriptor)
        passEncoder.setPipeline(_pipeline)
        passEncoder.setBindGroup(0, _bindGroup)
        passEncoder.draw(4)
        passEncoder.end()
    }
    return { init, draw, buffer}
})()