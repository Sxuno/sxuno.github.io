/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.pipeline = engine.pipeline || {}
engine.pipeline.basepass = (function () {
	let _bindgrouplayout = null
	let _bindgroup = null
	let _pipelinelayout = null
	let _pipeline = null
	let _descriptor = null
	let _renderTarget = null

	let _scene = null
	let _data = null
	let _buffer = null
	let _opQueue = null // for later

	async function init(device, context) {
		_scene = engine.scene.graph.raw() // TEMP	
		// DATA GLOBAL
			// TODO:
				// rework to preallocated TypedArrays for faster read write 
				// prepare for layout aware geometry buffer
		_data = {}
		// info (meta)
		engine.debug.start('basepass data')
		const projectionMatrix = engine.utils.math.perspective (0.398, context.canvas.width / context.canvas.height, _scene.camera['near'], _scene.camera['far'])
		const viewTransform = engine.utils.math.composeTRS(_scene.camera['location'], _scene.camera['rotation'], /*_scene.camera['scale'] # UNIFORM ONLY */ [1, 1, 1]) 
		const viewMatrix = engine.utils.math.mat4InverseUniform(viewTransform)
		const viewProjectionMatrix = engine.utils.math.multiply(projectionMatrix, viewMatrix)
		_data.metadata = {}	
		_data.metadata.canvasSize = [context.canvas.width, context.canvas.height]
		_data.metadata.canvasColor = engine.scene.data.info.viewport.color
		_data.metadata.canvasAlpha = engine.scene.data.info.viewport.alpha
		_data.metadata.viewProjectionMatrix = viewProjectionMatrix
		_data.metadata.lightNum = _scene.lights.length		
		// materials		
		_data.material = {}
		_data.material.rgb = {}
		_data.material.rgb.lookup = []
		for (const material of _scene.materials) {_data.material.rgb.lookup.push(material.rgb)} 
		// DATA SHARED SoA
		_data.mesh = {}
		_data.mesh.vertex = []
		_data.mesh.vertexMaterial = []
		_data.mesh.index = []
		_data.mesh.materialSlot = []
		_data.mesh.materialSlotOffset = []
		_data.mesh.modelMatrix = []
		let materialSlotOffset = 0
		let vertexOffset = 0
		for (const mesh of _scene.meshes) {
			for (const vertex of mesh.vertices) {_data.mesh.vertex.push(vertex)}
			_data.mesh.vertexMaterial.push(mesh.vertex_materials)					

			for (const index of mesh.indices) {_data.mesh.index.push(index + vertexOffset)} 
			_data.mesh.modelMatrix.push(engine.utils.math.composeTRS(mesh.location || [0, 0, 0], mesh.rotation || [0, 0, 0], mesh.scale || [1, 1, 1]))
			vertexOffset += mesh.vertices.length / 3
			if (mesh.materials.length === 0) {mesh.materials = [0]}
			
			for (const materialSlot of mesh.materials) {
				_data.mesh.materialSlot.push(materialSlot)							
			} 
			_data.mesh.materialSlotOffset.push(materialSlotOffset)		
			materialSlotOffset += mesh.materials.length			
		}
		engine.debug.end('basepass data')
		// BUFFER GLOBAL
			// TODO: update to call buffer through buffer id <context<buffer> instead of multible vars
		_buffer = {}
		_buffer.metadata = engine.gpu.buffer.metadata.create(_data.metadata) // GPUBufferUsage.UNIFORM
		_buffer.material = {}
		_buffer.material.color = engine.gpu.buffer.material.create(_data.material.rgb.lookup) // GPUBufferUsage.STORAGE		
		// BUFFER SHARED
		//engine.gpu.buffer.geometry.create(_data, 'debug')
		
		// BUFFER Geomentry
		_buffer.vertex = engine.gpu.buffer.vertex.create( _data.mesh.vertex) // GPUBufferUsage.VERTEX	
		_buffer.vertexMaterial = engine.gpu.buffer.vertex.color.create(_data.mesh.vertexMaterial) // GPUBufferUsage.VERTEX	
		_buffer.index = engine.gpu.buffer.index.create(_data.mesh.index) // GPUBufferUsage.INDEX
		_buffer.materialSlot = engine.gpu.buffer.material.slot.create(_data.mesh.materialSlot) // GPUBufferUsage.STORAGE
		_buffer.materialSlotOffset = engine.gpu.buffer.material.slot.offset.create(_data.mesh.materialSlotOffset) // GPUBufferUsage.STORAGE
		_buffer.modelMatrix = engine.gpu.buffer.modelMatrix.create(_data.mesh.modelMatrix) // GPUBufferUsage.STORAGE
		// BINDGROUP
		_bindgrouplayout = device.createBindGroupLayout({
			entries: [
				{binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
				{binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
				{binding: 2, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
				{binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
				{binding: 4, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
			]
		})
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
		})
		// PIPELINES
		_pipelinelayout = device.createPipelineLayout({bindGroupLayouts: [_bindgrouplayout]})		
		_pipeline = {}
		// cullmode back
		_pipeline.culling = device.createRenderPipeline({
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
				targets: [{ format: context.getCurrentTexture().format }],
			},
			primitive: {topology: 'triangle-list', cullMode: 'back', frontFace: 'ccw'},
			depthStencil: {format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less'}
    	})
		// cullmode none
		_pipeline.noculling = device.createRenderPipeline({
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
				targets: [{ format: context.getCurrentTexture().format }],
			},
			primitive: {topology: 'triangle-list', cullMode: 'none', frontFace: 'ccw'},
			depthStencil: {format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less'}
    	})
		_renderTarget = engine.gpu.view.create('basepass')
		_buffer.albedo = _renderTarget
		_descriptor = {
			colorAttachments: [
				{
					view: _renderTarget,
					loadOp: 'clear',
					storeOp: 'store',
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
				},
			],
			depthStencilAttachment: { 
				view: engine.pipeline.depthpass.buffer.get().createView({label: 'basepass descriptor depthStencilAttachment zBuffer view'}),
				depthClearValue: 1.0,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
			},
		}
	}
	const buffer = {
		get() {return _buffer}
	}
	function draw(encoder) {
		if (_scene.opQueue != null) {
			console.log(_scene.opQueue)
		}
		// pointer based method (low-level)
		const passEncoder = encoder.beginRenderPass(_descriptor)
		passEncoder.setBindGroup(0, _bindgroup)
		passEncoder.setVertexBuffer(0, _buffer.vertex)
		passEncoder.setVertexBuffer(1, _buffer.vertexMaterial)
		passEncoder.setIndexBuffer(_buffer.index, 'uint32')
		// drawcall loop
		let indexCount = 0
		let indexOffset = 0
		let instanceOffset = 0
		for (let i = 0; i < _scene.meshes.length; i++) {
			let culling = true
			for(const index of _scene.meshes[i].materials) {
				if (!_scene.materials[index].culling) {
					culling = false
					break
				}
			}
			let pipeline = culling ? _pipeline.culling : _pipeline.noculling
			passEncoder.setPipeline(pipeline)
			indexCount = _scene.meshes[i].indices.length
			instanceOffset = i
			passEncoder.drawIndexed(indexCount, 1, indexOffset, 0, instanceOffset)
			indexOffset += _scene.meshes[i].indices.length
		} 
		passEncoder.end()
	}
	return { init, draw, buffer }
})()