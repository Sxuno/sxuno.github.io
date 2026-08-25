/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.composepass = (function () {
    let _pipeline = null
    let _pipelineLayout
    let _bindGroup = null
    let _bindGroupLayout

    async function init(device, context) {
        _bindGroupLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d' } },
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }
            ]
        })
        _bindGroup = (context) => {return device.createBindGroup({
            label: 'Composepass',
            layout: _bindGroupLayout,
            entries: [
                { binding: 0, resource: engine.gpu.binding.sampleTexture('nearest')},
                { binding: 1, resource: engine.pipeline.basepass.buffer.get()[context.scene].albedo },
                { binding: 2, resource: engine.pipeline.lightpass.buffer.get()[context.scene].createView({label: 'composepass bindgroup resource[2]: lightpass buffer view'}) },
                { binding: 3, resource: {buffer: engine.pipeline.basepass.buffer.get()[context.scene].metadata} }
            ]
        })}
        _pipelineLayout = device.createPipelineLayout({bindGroupLayouts: [_bindGroupLayout]})
        _pipeline = (context) => {return device.createRenderPipeline({
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
                    code: engine.shader.compose.fragment
                }),
                entryPoint: 'main',
                targets: [{ format: context.getCurrentTexture().format }]
            },
            primitive: { topology: 'triangle-strip' }
        })}
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
        passEncoder.setPipeline(_pipeline(context))
        passEncoder.setBindGroup(0, _bindGroup(context))
        passEncoder.draw(4)
        passEncoder.end()
    }
    return { init, draw }
})()