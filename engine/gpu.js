/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.gpu = (function() {
	var _adapter = null
	var _device = null
	let _format = null
	let _context = null

	var _bindings = null
	var _sampler = null

	async function init() {
		if (!navigator) {throw new Error('WebGPU not supported')}
		_adapter = await navigator.gpu.requestAdapter()
		if (!_adapter) {throw new Error('GPU not supported')}

		_device =  await _adapter.requestDevice()
		_format = navigator.gpu.getPreferredCanvasFormat()
		_context = []
		for (const canvas of document.getElementsByTagName('canvas')) {
			_context.push(canvas.getContext('webgpu'))
			_context[_context.length -1].configure({
				device: _device,
				format: _format,
				alphaMode: 'premultiplied',
			})
		}
		console.log(`GPU init ${performance.now() - engine.STATS.delta} ms`)    
		return {_device, _format, _context}
	}
	// binding descriptor
	const bindings = {}
		bindings.show = function () {
			return _bindings
		}
	const binding = {}
		binding.sampleTexture = function (method) {
			_bindings = _bindings || {}
			_bindings.sampleTexture = _bindings.sampleTexture || []
			// method filter
			switch(method) {
				case 'nearest':
					break
				case 'linear':
					break
				default: 
					method = 'nearest'
					break
			}
			if (_bindings != null) {
				for (let entry of _bindings.sampleTexture) {
					if (entry['method'] == method) {
						return entry.binding
					}
				}
			}
			// register binding
			_sampler = _device.createSampler({
				label: `sampe method ${method}`,
				magFilter: method,
				minFilter: method
			})				
			_bindings.sampleTexture.push({'binding': _sampler, 'method': method})

			return _sampler
		}
	const buffer = {}
		buffer.metadata = buffer.metadata || {}
		buffer.metadata.create = function(metadata, usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST){
			const data = []
			for (const value of metadata.viewProjectionMatrix) {
				data.push(value)
			}
			data[16] = metadata.canvasSize[0]
			data[17] = metadata.canvasSize[1]
			data[18] = metadata.lightNum
			data[19] = 0
			
			if (metadata.canvasAlpha) {
				data[20] = 0
				data[21] = 0
				data[22] = 0
				data[23] = 0
			}
			else {
				
				data[20] = metadata.canvasColor[0]
				data[21] = metadata.canvasColor[1]
				data[22] = metadata.canvasColor[2]
				if (metadata.canvasColor.length < 4) { 
					data[23] = 1.0
				}
			}
			const typedArray = new Float32Array(data)
			const cachedBuffer = _device.createBuffer({
				label: 'metadata',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer			
		}
		// depth buffer
		buffer.depth = buffer.depth || {}
		buffer.depth.create = function() {
			throw new Error('depth create method not supported yet')
		}
		// material buffer
		buffer.material = buffer.material ||{}
		buffer.material.create = function(materialData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
			const data = []
			for (const rgb of materialData) {
				data.push(rgb[0], rgb[1], rgb[2], 0)
			}
			const typedArray = new Float32Array(data)
			const cachedBuffer = _device.createBuffer({
				label: 'Materials',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		// geometry buffer
		buffer.geometry = buffer.geometry || {}
		buffer.geometry.create = function(geometryData, usage) {
			if (usage != 'debug') {
				throw new Error('geometry buffer not supported yet')
			} else {
				console.log(`geometryData: ${typeof(geometryData)}`)
				console.log(geometryData)
			}
			// TODO: combine all mesh buffer and make it layout aware
			 /* geometryData : <object>[mesh[data]] or <object>[mesh[[datamesh1], [datamesh2]]*/
			 /* error on missalignment */
			 /* return buffer.geometry.mesh.vertex.get() , buffer.geometry.view.albedo.get() */

			 // vertex
			 // vertexColor
			 // index
			 // materialSlot
			 // materialSlotOffset
			 // modelMatrix
		}
		// light buffer
		buffer.light = buffer.light || {}
		buffer.light.create = function(lightData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
			
			const data = []
			for (const light of lightData) {
				data.push(
					light.location[0], 
					light.location[1], 
					light.location[2], 
					light.distance,
					light.color[0], 
					light.color[1], 
					light.color[2], 
					light.power,
				)
			}
			const typedArray = new Float32Array(data)
			const cachedBuffer = _device.createBuffer({
				label: 'Light Data',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		// TODO: Rework in progress see geometry buffer
		buffer.vertex = buffer.vertex || {}
		buffer.vertex.create = function(vertexData, usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
			const typedArray = vertexData instanceof Float32Array ? vertexData : new Float32Array(vertexData)
			const cachedBuffer = _device.createBuffer({
				label: 'Vertex',
				size: typedArray.byteLength,
				usage,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		buffer.vertex.color = buffer.vertex.color || {}
		buffer.vertex.color.create = function(vertexColorData, usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
			const typedArray = vertexColorData instanceof Uint32Array ? vertexColorData : new Uint32Array(vertexColorData)
			const cachedBuffer = _device.createBuffer({
				label: 'Vertex Materials',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		buffer.index = buffer.index || {}
		buffer.index.create = function(indexData, usage = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) {
			const typedArray = indexData instanceof Uint16Array || indexData instanceof Uint32Array ? indexData : new Uint32Array(indexData)
			const cachedBuffer = _device.createBuffer({
				label: 'Index',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		buffer.material = buffer.material || {}
		buffer.material.slot = buffer.material.slot || {}
		buffer.material.slot.create = function(slotData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
			const typedArray = slotData instanceof Uint32Array ? slotData : new Uint32Array(slotData)
			const cachedBuffer = _device.createBuffer({
				label: 'Material Slots',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		buffer.material.slot.offset = buffer.material.slot.offset || {}
		buffer.material.slot.offset.create = function(offsetData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
			const typedArray = new Uint32Array(offsetData)
			const cachedBuffer = _device.createBuffer({
				label: 'Material offset',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
		buffer.modelMatrix = buffer.modelMatrix || {}
		buffer.modelMatrix.create = function(modelMatrixData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
			const totalFloats = modelMatrixData.reduce((sum, m) => sum + m.length, 0)
			const typedArray = new Float32Array(totalFloats)
			let offset = 0
			for (const matrix of modelMatrixData) {
				typedArray.set(matrix, offset)
				offset += matrix.length
			}
			const cachedBuffer = _device.createBuffer({
				label: 'Model Matrix',
				size: typedArray.byteLength,
				usage,
				mappedAtCreation: false,
			})
			_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
			return cachedBuffer
		}
	// view textures
	const view = {}
		// TODO: add context aware combined resize observer
			// debug output as createView vs texture
		view.create = function(name) {
			// TODO: 
				// register with name to context
				// or 
				// register to geometry buffer
			texture = _device.createTexture({
				label: name,
				size: 	[_context[0].canvas.width, _context[0].canvas.height],
				format: _context[0].getCurrentTexture().format,
				usage:	GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
			})
			return texture.createView()
		}
	return { init, binding, bindings, buffer, view }

})()