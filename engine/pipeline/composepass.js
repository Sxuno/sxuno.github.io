/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.composepass = (function () {
    let _pipeline = null
    let _bindGroup = null

    async function init(device, context) {
        _pipeline = device.createRenderPipeline({
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
                    code: engine.shader.compose.fragment
                }),
                entryPoint: 'main',
                targets: [{ format: context.getCurrentTexture().format }]
            },
            primitive: { topology: 'triangle-strip' }
        })
        _bindGroup = device.createBindGroup({
            label: 'Composepass',
            layout: _pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: engine.gpu.binding.sampleTexture('nearest')},
                { binding: 1, resource: engine.pipeline.basepass.buffer.get().albedo },
                { binding: 2, resource: engine.pipeline.lightpass.buffer.get().createView({label: 'composepass bindgroup resource[2]: lightpass buffer view'}) },
                { binding: 3, resource: {buffer: engine.pipeline.basepass.buffer.get().metadata} }
            ]
        })
    }
    function _descriptor(context) {
        return {
            colorAttachments: [{
                view: context.getCurrentTexture().createView({label: 'composepass descriptor view context'}),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 0 }
            }]
        }
    }
    function draw(encoder, context) {
        // pointer based method (low-level)
        const passEncoder = encoder.beginRenderPass(_descriptor(context))
        passEncoder.setPipeline(_pipeline)
        passEncoder.setBindGroup(0, _bindGroup)
        passEncoder.draw(4)
        passEncoder.end()
    }
    return { init, draw }
})()