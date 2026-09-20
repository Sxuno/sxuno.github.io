/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.gpu = (function(){

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 


	let _descriptor // context :: devices workloads allocations

	// GPU
	let _format
	let _features

	// DEVICE
	let _adapter
	let _device
	let _limits // in use

	// RESOURCES
	let _resource // descriptor object?

	let _type
	let _buffer
	let _texture  = new Array() //  complexity aspectratio x width x {type:: GPUOBJECT} // TODO: define at runtime
	let _sampler

	let _binding // {buffer : () => return _buffer, texture : () => return _texture, sampler : () => return _sampler}

	let _bindGroupLayout
	let _bindGroup
	let _pipelineLayout
	let _pipeline
	
	// MEMORY ?
	let _alloc

	const controller = (function (){// overrides 
		// Adapter
		let _requestAdapter
		// Device
		let _requestDevice
		let _queue
		let _submit
		// Encoder
		let _createCommandEncoder
		let _beginRenderPass
		let _end

		const init = async () => {
			_requestAdapter = navigator.gpu.requestAdapter
			// Override Adapter
			navigator.gpu.requestAdapter = async function(...args) {
				engine.log.info('controller gpu : adapter request')
				engine.debug?.timer.start('adapter request')
				_adapter = await _requestAdapter.apply(this, args)
				engine.debug?.timer.end('adapter request')
				return _adapter
			}
			await navigator.gpu.requestAdapter()
			// Override Device
			_requestDevice = _adapter.requestDevice
			_adapter.requestDevice = async function(...args) {
				engine.log.info('controller gpu : device request')
				engine.debug?.timer.start('device request')
				_device = await _requestDevice.apply(this, args)
				engine.debug?.timer.end('device request')
				return _device
			}
			await _adapter.requestDevice()
			controller.monitor(_device)
			_limits = _device.limits

		}
		const monitor = function(device) {
			device.lost.then(async (info) => {
				console.log(info)
				_device = null // note release before request as safeguard for gpu gc
				_device = await _adapter.requestDevice()
				controller.monitor(_device)
				// note : logic works but user has to actively switch tabs to reinitialize raf
				// engine.runtime.init()
			})
		}
		return {init, monitor}
	})() 

	const scheduler = (function (){// task scheduling only
		
	})()

	// ======
	// PUBLIC
	// ======

	const buffer = {

	}

	const compute = {
		// compute shader api method ... return result [buffer]
		// extension hook gpu.init() //dependencies ? 
	}

	const resource = { // TODO : RETHINK!!!
		init : async (resource) => { // flag? 
			console.log('resource', resource)

			// move allocation to init
			_binding = _binding || new Array()
			_resource = _resource || new Array()
			_type = _type || {texture: 0}
			_texture = _texture || new Array

			// resource complexity = type x {resource} x object id x instance count
			if (resource.texture !== undefined) {
				
				let format = resource.texture.format
				let usage = resource.texture.usage
				let aspectratio = resource.texture.size[0] / resource.texture.size[1]
				let size = resource.texture.size[0]

				let f 
				let u 
				let a 
				let s 

				// f = _resource[_type.texture].findIndex(format => format[0] === resource.texture.format)

				//console.log(_texture['format']?.['usage']?.['aspectratio']?.['width'])

				_texture.push(_device.createTexture(resource.texture))
				_binding.push(resource.buffer)

				console.log('ratio', aspectratio)				
				console.log('size', resource.texture.size)
				
				_resource.push([_type.texture,[aspectratio,[size,[_texture.length-1,[1]]]]])

				console.error('DATASTRUCTURE RESOURCE', _resource)
				console.log(_texture[_resource[_resource.length-1][1][1][1][0]])
				// resource[type][format][usage][aspectratio][width][_texture[id]][count]
			}
			_binding.push(resource.binding)
		},
		release : async (resource) => {}, // note : method for usage release
	}

	const pipline = {
		// placeholder for context init/ runtimehook ???
	}

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init gpu')
		engine.eventdispatcher.dispatchEvent(new Event('InitGPU'))
		_format = navigator.gpu.getPreferredCanvasFormat()
		_features = new Array
		for (const feature of navigator.gpu.wgslLanguageFeatures.values()) {
			_features.push(feature)
		}
		async function loadhandler(context){
			// LOADHANDLER
			if(_readystate) {
				// RUNTIMEHOOK
			} else {
				// CONFIGURATION
				engine.log.info('gpu init')
				if (!_device) {
					await controller.init()
				}
				if (_device) {
					engine.gpu.device = () => {return _device}
					engine.gpu.format = _format
				}
			}
		} 
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let gpu = {
		init,
		resource
	}
	// CONDITIONAL
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