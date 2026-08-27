/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.basepass = (function () {
	let _bindgrouplayout = null
	let _bindgroup = null
	let _pipelinelayout = null
	let _pipeline = null
	let _descriptor = null
	let _renderTarget = null

	let _data = null
	let _buffer = null
	// temp
	let hi = 0 // context switch
	let _scene
	let _sd

	async function init(device, context) {
		engine.debug?.timer.start('basepass data')

		_sd = engine.scene.data
		_scene = engine.scene.graph.descriptor()
		// DATA GLOBAL
		_data = new Array(_scene.length)
		_buffer = new Array(_scene.length)
		_renderTarget = new Array(_scene.length)
		 // QUICKFIX 
		for(let i = 0; i < _scene.length; i++) {
			_data[i] = new Object
			/* info (meta) */		
			let projectionMatrix = engine.utils.math.perspective (0.398, context[i].canvas.width / context[i].canvas.height, _sd.camera[_scene[i].camera[0]]['near'], _sd.camera[_scene[i].camera[0]]['far'])
			let viewTransform = engine.utils.math.composeTRS(_sd.camera[_scene[i].camera[0]]['location'], _sd.camera[_scene[i].camera[0]]['rotation'], /* .camera['scale'] # UNIFORM ONLY */ [1, 1, 1]) 
			let viewMatrix = engine.utils.math.mat4InverseUniform(viewTransform)
			let viewProjectionMatrix = engine.utils.math.multiply(projectionMatrix, viewMatrix)
			_data[i].metadata = {}	
			_data[i].metadata.canvasSize = [context[i].canvas.width, context[i].canvas.height]
			_data[i].metadata.canvasColor = engine.scene.info[i].viewport.color
			_data[i].metadata.canvasAlpha = engine.scene.info[i].viewport.alpha
			_data[i].metadata.viewProjectionMatrix = viewProjectionMatrix
			_data[i].metadata.lightNum = _scene[i].light.length

			/* materials */	
			_data[i].material = {}
			_data[i].material.rgb = {}
			_data[i].material.rgb.lookup = []
			for(let m = 0, len = _scene[hi].material.length; m < len; m++) {
				_data[i].material.rgb.lookup.push(_sd.material[_scene[i].material[m]].rgb)
			}
			/* DATA SHARED SoA */
			_data[i].mesh = {}
			_data[i].mesh.vertex = []
			_data[i].mesh.vertexMaterial = []
			_data[i].mesh.index = []
			_data[i].mesh.materialSlot = []
			_data[i].mesh.materialSlotOffset = []
			_data[i].mesh.modelMatrix = []
			let materialSlotOffset = 0
			let vertexOffset = 0
			for(let m = 0, len = _scene[i].mesh.length; m < len; m++) {
				let mesh = _sd.mesh[_scene[i].mesh[m]]
				for (const vertex of mesh.vertices) {_data[i].mesh.vertex.push(vertex)}
				_data[i].mesh.vertexMaterial.push(mesh.vertex_materials)
				for (const index of mesh.indices) {_data[i].mesh.index.push(index + vertexOffset)} 
				_data[i].mesh.modelMatrix.push(engine.utils.math.composeTRS(mesh.location || [0, 0, 0], mesh.rotation || [0, 0, 0], mesh.scale || [1, 1, 1]))
				vertexOffset += mesh.vertices.length / 3
				if (mesh.materials.length === 0) {mesh.materials = [0]}
				
				for (const materialSlot of mesh.materials) {
					_data[i].mesh.materialSlot.push(materialSlot)
				} 
				_data[i].mesh.materialSlotOffset.push(materialSlotOffset)
				materialSlotOffset += mesh.materials.length
			}
			// BUFFER GLOBAL
			// TODO: update to call buffer through buffer id <context<buffer> instead of multiple vars
			_buffer[i] = new Object
			_buffer[i].metadata = engine.gpu.buffer.metadata.create(_data[i].metadata) // GPUBufferUsage.UNIFORM
			_buffer[i].material = {}
			_buffer[i].material.color = engine.gpu.buffer.material.create(_data[i].material.rgb.lookup) // GPUBufferUsage.STORAGE
			/* BUFFER SHARED */
			// BUFFER Geometry
			_buffer[i].vertex = engine.gpu.buffer.vertex.create( _data[i].mesh.vertex) // GPUBufferUsage.VERTEX
			_buffer[i].vertexMaterial = engine.gpu.buffer.vertex.color.create(_data[i].mesh.vertexMaterial) // GPUBufferUsage.VERTEX	
			_buffer[i].index = engine.gpu.buffer.index.create(_data[i].mesh.index) // GPUBufferUsage.INDEX
			_buffer[i].materialSlot = engine.gpu.buffer.material.slot.create(_data[i].mesh.materialSlot) // GPUBufferUsage.STORAGE
			_buffer[i].materialSlotOffset = engine.gpu.buffer.material.slot.offset.create(_data[i].mesh.materialSlotOffset) // GPUBufferUsage.STORAGE
			_buffer[i].modelMatrix = engine.gpu.buffer.modelMatrix.create(_data[i].mesh.modelMatrix) // GPUBufferUsage.STORAGE

			_renderTarget[i] = engine.gpu.view.create('basepass')
			_buffer[i].albedo = _renderTarget[i]
		}
		engine.debug?.timer.end('basepass data')

		/* BINDGROUP */
		_bindgrouplayout = device.createBindGroupLayout({
			entries: [
				{binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
				{binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
				{binding: 2, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
				{binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
				{binding: 4, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
			]
		})
		/*
		_bindgroup = device.createBindGroup({
			label: 'Basepass',
			layout: _bindgrouplayout,
			entries: [
				{binding: 0, resource: {buffer: _buffer.metadata}},
				{binding: 1, resource: {buffer: _buffer.modelMatrix}},
				{binding: 2, resource: {buffer: _buffer.materialSlot}},
				{binding: 3, resource: {buffer: _buffer.materialSlotOffset}},
				{binding: 4, resource: {buffer: _buffer.material.color}},
			],
		})*/
		// QUICKFIX
		_bindentries = (context) => {return device.createBindGroup({
			label: 'Basepass',
			layout: _bindgrouplayout,
			entries: [
				{binding: 0, resource: {buffer: _buffer[context].metadata}},
				{binding: 1, resource: {buffer: _buffer[context].modelMatrix}},
				{binding: 2, resource: {buffer: _buffer[context].materialSlot}},
				{binding: 3, resource: {buffer: _buffer[context].materialSlotOffset}},
				{binding: 4, resource: {buffer: _buffer[context].material.color}},
			],
		})}
		/* PIPELINES */
		_pipelinelayout = device.createPipelineLayout({bindGroupLayouts: [_bindgrouplayout]})
		_pipeline = {}
		/* cullmode back */
		_pipeline.culling = (id) => {return device.createRenderPipeline({
			layout: _pipelinelayout,
			vertex: {
				module: device.createShaderModule({
					label: 'vertex',
					code: engine.shader.geometry.vertex
				}),
				entryPoint: 'main',
				buffers: [
					{arrayStride: 12, attributes: [{shaderLocation: 0, offset: 0,	format: 'float32x3'}]},
					{arrayStride: 4, attributes: [{shaderLocation: 1, offset: 0, format: 'uint32'}]}
				],
			},
			fragment: {
				module: device.createShaderModule({
					label: 'fragment',
					code: engine.shader.geometry.fragment
				}),
				entryPoint: 'main',
				targets: [{ format: context[id].getCurrentTexture().format }],
			},
			primitive: {topology: 'triangle-list', cullMode: 'back', frontFace: 'ccw'},
			depthStencil: {format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less'}
    	})}
		/* cullmode none */
		_pipeline.noculling = (id) => {return device.createRenderPipeline({
			layout: _pipelinelayout,
			vertex: {
				module: device.createShaderModule({
					label: 'vertex',
					code: engine.shader.geometry.vertex
				}),
				entryPoint: 'main',
				buffers: [
					{arrayStride: 12, attributes: [{shaderLocation: 0, offset: 0,	format: 'float32x3'}]},
					{arrayStride: 4, attributes: [{shaderLocation: 1, offset: 0, format: 'uint32'}]},
				],
			},
			fragment: {
				module: device.createShaderModule({
					label: 'fragment',
					code: engine.shader.geometry.fragment
				}),
				entryPoint: 'main',
				targets: [{ format: context[id].getCurrentTexture().format }],
			},
			primitive: {topology: 'triangle-list', cullMode: 'none', frontFace: 'ccw'},
			depthStencil: {format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less'}
    	})}

		_descriptor = (context) => {return {
			colorAttachments: [
				{
					view: _renderTarget[context.scene],
					loadOp: 'clear',
					storeOp: 'store',
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
				},
			],
			depthStencilAttachment: { 
				view: engine.pipeline.depthpass.buffer.get()[context.scene].createView({label: 'basepass descriptor depthStencilAttachment zBuffer view'}),
				depthClearValue: 1.0,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
			},
		}}
	}
	const buffer = {
		get() {return _buffer}
	}
	function draw(encoder, context, c) {
		
		// pointer based method (low-level)
		const passEncoder = encoder.beginRenderPass(_descriptor(context))
		passEncoder.setBindGroup(0, _bindentries(context.scene))
		passEncoder.setVertexBuffer(0, _buffer[context.scene].vertex)
		passEncoder.setVertexBuffer(1, _buffer[context.scene].vertexMaterial)
		passEncoder.setIndexBuffer(_buffer[context.scene].index, 'uint32')
		/* drawcall loop */
		let indexCount = 0
		let indexOffset = 0
		let instanceOffset = 0
		for (let i = 0; i < _scene[context.scene].mesh.length; i++) {
			let culling = true
			for(let j = 0; j < _scene[context.scene].material.length; j++) {
				if (!_sd.material[_scene[context.scene].material[j]].culling) {
					culling = false
					break
				}
			}
			let pipeline = culling ? _pipeline.culling(context.scene) : _pipeline.noculling(context.scene)
			passEncoder.setPipeline(pipeline)
			indexCount = _sd.mesh[_scene[context.scene].mesh[i]].indices.length
			instanceOffset = i
			passEncoder.drawIndexed(indexCount, 1, indexOffset, 0, instanceOffset)
			indexOffset += _sd.mesh[_scene[context.scene].mesh[i]].indices.length
		} 
		passEncoder.end()
	}
	return { init, draw, buffer}
})()