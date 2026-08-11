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

	// GPU
	let _format
	let _features
	// DEVICE
	let _adapter
	let _device
	let _limits
	// CONTEXT
	let _context
	let _config
	let _setup
	// RESOURCES
	let _binding
	let _sampler

	let _readystate

	const compute = {
		// compute shader api method ... return result [buffer]
		// extension hook gpu.init() //dependencies ? 
	}

	// ======
	// PUBLIC
	// ======

	const resource = {
		init : async (context) => {
			console.log(`resource init ${context.buffer}`)
			engine.pipeline.buffer(context.buffer)
		}
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


/*
 bindgroup.depthpass(context) {

	data = engine.pipeline.buffer[context.buffer] = {texture : depthtexture}

	gpu.buffer = engine.pipeline.buffer[context.buffer]
 }
 */