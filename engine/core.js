/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

// TODO: add engine benchmark and preformance values here
engine = {}
engine.STATS = engine.STATS ||{}
engine.STATS.gpu = null
engine.STATS.delta = {}
engine.STATS.frametime = null
engine.STATS.delta = performance.now()

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
// Scripts
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
			'engine/scene/data.js',
			'engine/scene/graph.js',
		]
	})()
)) {
	let script = document.createElement('script')
	script.src = src
	document.head.appendChild(script)
}
// TODO: update to access module inits through eg engine.core.init.gpu() etc
engine.init = () => {
  	(async () => {
		try {
		if (document.readyState === 'loading') {
			await new Promise(resolve => {
				window.addEventListener('load', resolve, { once: true }) // instead of DOMContentloaded to avoid a manual timeoutloop
			})
		}
		console.log('WEBSITE init '+ engine.STATS.delta + ' ms')
		const {_device, _format, _context} = await engine.gpu.init()
		engine.runtime.init(_device, _context[0], _format)
		} catch (err) {console.error(err)}
 	})()
}
// TODO: update with triggers to show stats
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
// TODO: move init orchestration here as system integration controll point.
engine.core = engine.core || {}

engine.pipeline = engine.pipeline || {}
engine.pipeline.init = async function(name) {
	if (!engine.pipeline[name]) {
		let script = document.createElement('script')
		script.src = `engine/pipeline/${name}.js`
		document.head.appendChild(script)
	}
}