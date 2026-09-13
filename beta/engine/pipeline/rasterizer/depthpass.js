/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.pipeline.rasterizer.depthpass = (function () {

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 
	
	let _context  // complexity : scene x camera x renderer x view = pipeline x layout x group x grouplayout x resource {bufferobject?}
	let _descriptor

	// PIPELINE
	let _resource
	let _bindGroupLayout
	let _bindGroup
	let _pipelineLayout
	let _pipeline
	
	// RESOURCE
	let _binding
	let _renderTarget

	// wrap in function for instances
	const construct = function(context){}

	_resource = {texture : 	{label : `depth`, size: [0, 0, 1], format: 'depth24plus', usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,}}

	_bindGroupLayout = { entries : [
			{binding: 0, visibility: 'PIPELINE', texture : {type : 'depth24plus'}}
		]
	}
	_bindGroup = {
		label: 'Depthpass',
		layout: _bindGroupLayout,
		entries : [
			{binding: 0, resource: _resource}
		]
	}
	_pipelineLayout = {_bindGroupLayouts: [_bindGroupLayout]}
	_pipeline = {
		layout : _pipelineLayout,
	}

	const renderTarget = async (context) => { // depracating to be replaced by construct
		console.log('init renderTarget')
		let x = context.width
		let y = context.height
		
		// await gpu resource callback :: binding id
		_renderTarget = await engine.gpu.resource.init( 
			{
				texture : 
				{
					label : `${_bindGroup.label}::${context.buffer.join('')}x${context.index}`,
					size: [x, y, 1],
					format: 'depth24plus',
					usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
				}, 
			}
		)
	}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// dependencies
		engine.log.event('init rasterizer depthpass')
		// engine.eventdispatcher.dispatchEvent(new Event(''))
		_readystate = true
		async function loadhandler(context){
			// loadhandler
			if(!_readystate) {
				// context init
			} else {
				// runtimehook
				console.warn('rasterizer depthpass init (context)')
				console.log('depthpass init(context)')
				console.log(`binding ${context.buffer.join('')}x${context.index}`)

				context['width'] = (!context.width) ? context.canvas.width : context.width
				context['height'] = (!context.height) ? context.canvas.height : context.height

				await renderTarget(context)
			}
		}
		return loadhandler
	})()

	const descriptor = () => {return _descriptor}

	const draw = function (scene) {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let depthpass = {init, draw, }
	// CONDITIONAL
	// RETURN VAR
	return depthpass
})()