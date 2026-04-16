/*
 * This file is part of WebGPU-Engine.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.gpu = (function() {

	// =======
	// PRIVATE
	// =======

	// GPU
	let _format = null
	let _features
	/* DEVICE */
	var _adapter = null
	var _device = null
	let _limits
	/* GPU CONTEXT */
	let _context = null
	let _config = null
	let _setup = null
	/* GPU RESOURCES */
	var _bindings = null
	var _sampler = null

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies
		engine.log.event('init gpu')
		engine.eventdispatcher.dispatchEvent(new Event('InitGPU'))
		_format = navigator.gpu.getPreferredCanvasFormat()
		_features = new Array
		for (const value of navigator.gpu.wgslLanguageFeatures.values()) {
			_features.push(value)
		}
		async function loadhandler(context){
			// context loader
			engine.log.info('gpu init')
			engine.debug.timer.start('gpu init')
			if (!_device) {
				_adapter = await navigator.gpu.requestAdapter()
				if(_adapter){
					_device = await _adapter.requestDevice()
					_limits = _device.limits
				}
			}
			if (_device) {
				engine.gpu.device = _device
				engine.gpu.format = _format
			}
			engine.debug.timer.end('gpu init')
		}
		return loadhandler
	})()

	const binding = {
		sampleTexture : function (method) {
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
			/* register binding */
			_sampler = _device.createSampler({
				label: `sampe method ${method}`,
				magFilter: method,
				minFilter: method
			})
			_bindings.sampleTexture.push({'binding': _sampler, 'method': method})

			return _sampler
		},
	}

	const buffer = {
		metadata : {
			create : function(metadata, usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST){
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
			},
		},
		/* depth buffer */
		depth : {
			create : function() {
				throw new Error('depth create method not supported yet')
			},
		},
		/* material buffer */
		material : {
			create : function(materialData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
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
			},
			slot : {
				create : function(slotData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
					const typedArray = slotData instanceof Uint32Array ? slotData : new Uint32Array(slotData)
					const cachedBuffer = _device.createBuffer({
						label: 'Material Slots',
						size: typedArray.byteLength,
						usage,
						mappedAtCreation: false,
					})
					_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
					return cachedBuffer
				},
				offset : {
					create : function(offsetData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
						const typedArray = new Uint32Array(offsetData)
						const cachedBuffer = _device.createBuffer({
							label: 'Material offset',
							size: typedArray.byteLength,
							usage,
							mappedAtCreation: false,
						})
						_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
						return cachedBuffer
					},
				},
			},
		},
		/* geometry buffer */
		geometry : {
			create : function(geometryData, usage) {
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
			},
		},
		/* light buffer */
		light : {
			create : function(lightData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
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
			},
		},
		// TODO: Rework in progress see geometry buffer
		vertex : {
			create : function(vertexData, usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
				const typedArray = vertexData instanceof Float32Array ? vertexData : new Float32Array(vertexData)
				const cachedBuffer = _device.createBuffer({
					label: 'Vertex',
					size: typedArray.byteLength,
					usage,
				})
				_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
				return cachedBuffer
			},
			color : {
				create : function(vertexColorData, usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
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
			},
		},
		index : {
			create : function(indexData, usage = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) {
				const typedArray = indexData instanceof Uint16Array || indexData instanceof Uint32Array ? indexData : new Uint32Array(indexData)
				const cachedBuffer = _device.createBuffer({
					label: 'Index',
					size: typedArray.byteLength,
					usage,
					mappedAtCreation: false,
				})
				_device.queue.writeBuffer(cachedBuffer, 0, typedArray)
				return cachedBuffer
			},
		},
		modelMatrix : {
			create : function(modelMatrixData, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST) {
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
			},
		},
	}

	/* view textures */
	const view = {
		// TODO: 
			// add context aware resize observer
			// debug output as createView vs texture
		create : function(name) {
			view.texture = _device.createTexture({
				label: name,
				size: [engine.gpu.context[0].canvas.width, engine.gpu.context[0].canvas.height],
				format: engine.gpu.context[0].getCurrentTexture().format,
				usage:	GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
			})
			return view.texture.createView()
		}
	}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	gpu = {
		init: init,
		binding : binding,
		buffer : buffer,
		view : view,
	}
	// IF FEATURESET VAR.FEATURE
	if(_features.includes('readonly_and_readwrite_storage_textures')) {
		gpu.features = gpu.features || []
		gpu.features.push('readonly_and_readwrite_storage_textures')
	}
	if(_features.includes('packed_4x8_integer_dot_product')) {
		gpu.features = gpu.features || []
		gpu.features.push('packed_4x8_integer_dot_product')
	}
	if(_features.includes('pointer_composite_access')) {
		gpu.features = gpu.features || []
		gpu.features.push('pointer_composite_access')
	}
	// RETURN VAR
	return gpu
})()