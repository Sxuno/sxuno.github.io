/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.lightpass = (function () {
    let _pipeline = null
    let _pipelineLayout
    let _bindGroup = null
    let _bindGroupLayout
    let _descriptor = null
    let _renderTarget = null

    async function init(device, context) {
        _renderTarget = new Array(engine.scene.graph.descriptor().length)
        for (let i = 0; i < engine.scene.graph.descriptor().length; i++) {
            _renderTarget[i] = device.createTexture({
                label: 'lightpass _renderTarget',
                size: [context[i].canvas.width, context[i].canvas.height],
                format: 'rgba16float',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
            })
        }
        _bindGroup = (id) => {return device.createBindGroup({
            label: 'Lightpass',
            layout: _bindGroupLayout,
            entries: [
                { binding: 0, resource: engine.pipeline.basepass.buffer.get()[id].albedo },
                { binding: 1, resource: engine.pipeline.depthpass.buffer.get()[id].createView({label: 'lightpass bindgroup view zBuffer'}) },
                { binding: 2, resource: engine.gpu.binding.sampleTexture()},
                { binding: 3, resource: { buffer: engine.pipeline.shadowpass.buffer.get()[id].lights }},
                { binding: 4, resource: { buffer: engine.pipeline.shadowpass.buffer.get()[id].metadata }}
            ]
        })}
        _bindGroupLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth', viewDimension: '2d' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
                { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }
            ]
        })
        _pipelineLayout = device.createPipelineLayout({bindGroupLayouts: [_bindGroupLayout]})
        _pipeline = device.createRenderPipeline({
            label: 'Lightpass',
            layout: _pipelineLayout,
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


        _descriptor = (id) => {return {
            colorAttachments: [
                {
                    view: _renderTarget[id].createView({label: 'lightpass descriptor view renderTarget'}),
                    loadOp: 'clear',
                    storeOp: 'store',
                    clearValue: { r: 0, g: 0, b: 0, a: 0 }
                }

            ]
        }}
    }
    const buffer = { get() { return _renderTarget}}
    function draw(encoder, context, id) {
        // pointer based method (low-level)
        const passEncoder = encoder.beginRenderPass(_descriptor(context.scene))
        passEncoder.setPipeline(_pipeline)
        passEncoder.setBindGroup(0, _bindGroup(context.scene))
        passEncoder.draw(4)
        passEncoder.end()
    }
    return { init, draw, buffer}
})()