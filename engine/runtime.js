/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.runtime = (function () {
	let _device = null
	let _format = null
	let _context = null

	async function init(device, context, format) {
		_device = device
		_format = format
		_context = context
		
		engine.debug.start('load scene')
		await engine.scene.data.info.init()
		await engine.scene.data.init()
		await engine.scene.graph.init()
		engine.debug.end('load scene')

		engine.debug.start('pass init')
		await engine.pipeline.depthpass.init(_device, _context)
		await engine.pipeline.basepass.init(_device, _context)
		await engine.pipeline.shadowpass.init(_device, _context)
		await engine.pipeline.lightpass.init(_device, _context)
		await engine.pipeline.composepass.init(_device, _context)
		engine.debug.end('pass init')

		requestAnimationFrame(frame)
	}
	function frame() {
		
		engine.STATS.delta = performance.now()

		const encoder = _device.createCommandEncoder()
		// Defered Drawcalls
		engine.pipeline.depthpass.draw(_device, _context)
		engine.pipeline.basepass.draw(encoder)
		engine.pipeline.shadowpass.draw(encoder)
		engine.pipeline.lightpass.draw(encoder)
		engine.pipeline.composepass.draw(encoder, _context)

		_device.queue.submit([encoder.finish()])

		engine.STATS.frametime = performance.now() - engine.STATS.delta
		document.getElementById('stats').innerText = `ms ${engine.STATS.frametime}`

		requestAnimationFrame(frame)
	}
	return { init,}
})()