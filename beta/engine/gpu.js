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


	const scheduler = (function (){// TODO encoder.prototype submit.prototype device.prototype
		let adapter
		let device
		const init = async () => {
			const requestAdapter = navigator.gpu.requestAdapter
			// Override
			navigator.gpu.requestAdapter = async function(...args) {
				console.warn('Scheduler register Adapter')
				_adapter = await requestAdapter.apply(this, args)
				// fallbacks here
				return _adapter
			}
			await navigator.gpu.requestAdapter()
		}
		return {init}
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

	const resource = {
		init : async (resource) => { // flag? 
			console.log('resource', resource)
			_resource = _resource || new Array() // group by type for faster lookup
			_binding = _binding || new Array()
			let bind = new Array()

			// resource complexity = binding + size + usage
			if (resource.texture !== undefined) {
					let aspectratio = resource.texture.size[0] / resource.texture.size[1]
					console.log('ratio', aspectratio)
					let size = resource.texture.size[0]
					console.log('size', resource.texture.size)
					// [number:aspectratio,[number:size,[{type: depth, GPUObject : ..., instances: number}]]]
					console.error('create mookup')
					bind.push([_resource.length-1])
					// TODO add resource pointer structure :: check for redundency
					_resource.push(_device.createTexture(resource.texture))
					console.log(_resource)
			}
			// HERE 
			_binding.push(resource.binding)
		},
		release : async (resource) => {}, // note : method for usage release

	}

	const init = (function() {
		// init dependencies
		engine.log.event('init gpu')
		engine.eventdispatcher.dispatchEvent(new Event('InitGPU'))
		_format = navigator.gpu.getPreferredCanvasFormat()
		_features = new Array
		for (const feature of navigator.gpu.wgslLanguageFeatures.values()) {
			_features.push(feature)
		}
		async function loadhandler(context){
			// context loader
			if(!_readystate) {
				engine.log.info('gpu init')
				engine.debug.timer.start('gpu init')
				if (!_device) {
					await scheduler.init()
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
			} else {
				// runtimehook
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