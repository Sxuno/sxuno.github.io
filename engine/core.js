/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

// TODO: 
	// update with binding to show stats
engine = {}
engine.STATS = engine.STATS ||{}
engine.STATS.gpu = null
engine.STATS.delta = {}
engine.STATS.frametime = null
engine.STATS.delta = performance.now()
// TEST
engine.STATS.test = (function()  {
	let _gpu = null
	const gpu = {}
		gpu.get = function() {
			return _gpu
		}
		gpu.set = function(bool) {
			bool ? _gpu = bool : _gpu = !_gpu // TODO: make to xor bitwise
			if(engine.bindings?.gpu?.set) {
				engine.bindings.gpu.set(_gpu)
			}
		}
})()
/* Scripts */
// TODO: split to justInTime principle
for (var [index, src] of Object.entries(
	(() => {
		return [
			'engine/gpu.js',
			'engine/runtime.js',
			'engine/utils/math.js',
			'engine/bindings.js',
			'engine/pipeline/depthpass.js',
			'engine/pipeline/basepass.js',
			'engine/pipeline/shadowpass.js',
			'engine/pipeline/lightpass.js',
			'engine/pipeline/composepass.js',
			'engine/shader/shared.js',
			'engine/shader/geometry.js',
			'engine/shader/shadows.js',
			'engine/shader/lights.js',
			'engine/shader/compose.js',
		]
	})()
)) {
	let script = document.createElement('script')
	script.src = src
	document.head.appendChild(script)
}
// TODO: update to access module inits through eg engine.core.init.gpu() etc
engine.init = (method) => {
  	(async () => {
		try {
		if (document.readyState === 'loading') {
			await new Promise(resolve => {
				window.addEventListener('load', resolve, { once: true }) // instead of DOMContentloaded to avoid a manual timeoutloop
			})
		}
		console.log('WEBSIDE init '+ engine.STATS.delta + ' ms')
		const {_device, _format, _context} = await engine.gpu.init()
		engine.runtime.init(_device, _context[0], _format)
		} catch (err) {console.error(err)}
 	})()
}
engine.debug = {
	enabled: true,
	timers: {},
	start(label) {
		if (!this.enabled) return
		this.timers[label] = performance.now()
	},
	end(label) {
		if (!this.enabled || !this.timers[label]) return
		const delta = performance.now() - this.timers[label]
		console.log(`[DEBUG] ${label}: ${delta.toFixed(2)}ms`)
		delete this.timers[label]
	},
	timer(label, fn) {
		if (!this.enabled) {
			fn()
			return
		}
		this.start(label)
		fn()
		this.end(label)
	},
	log(fstring) { console.log(fstring)}
}
engine.core = engine.core || {}
/* 95117 core script loader */
engine.core.script = async function(path){
	var _scripts = []
	switch(typeof(path)) {
		case 'string':
			_scripts.push([path])
			break
		case 'array':
			_scripts.push(path)
			break
		default:
			console.error(`${typeof(path)} not supported`)
		break
	}
	for(let script of _scripts) {
		await new Promise((resolve)=> {
			let _script = document.createElement('script')
			_script.src = script
			_script.onload = resolve
			document.head.appendChild(_script)
		})
	}
}
/* 118123 scene init */
engine.scene = engine.scene || {}
engine.scene.init = async function(){
	await engine.core.script('engine/scene/data.js')
	await engine.core.script('engine/scene/graph.js')
}