/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.runtime = (function () {
	let _device = null
	let _format = null
	let _context = null

	async function init(device, format) {
		_device = device
		_format = format
		_context = engine.gpu.context[0]
		
		engine.debug.start('load scene')

		await engine.scene.init()
		for (let index in engine.gpu.context) {
			await engine.scene.load(engine.gpu.context[index].config.scene)					
		}
		/* TODO: rethink scene graph in multiscene support context */
			await engine.scene.graph.init()
			/* 
				scene info frame (controlled by runtime renderer #second.(framenumber per second or keyframe size))
				scene info delta (controlled by runtime logic #timeline #keyframes)
				scene info buffer (lookup throug index arry?)
					buffer lifetime = gpu.buffer.get(context) buffer throu context? or scene?
				execution:
					get sences by name
						check frame delta
					per dif create buffers and call pipline
			*/
		engine.debug.end('load scene')

		engine.debug.start('pass init')
		/* TODO: make it data driven and context dependend instead of 'giving' context,
				may move to  core.js > pipeline init (dose not exist yet) */
			await engine.pipeline.depthpass.init(_device, _context)
			await engine.pipeline.basepass.init(_device, _context)
			await engine.pipeline.shadowpass.init(_device, _context)
			await engine.pipeline.lightpass.init(_device, _context)
			await engine.pipeline.composepass.init(_device, _context)

		engine.debug.end('pass init')

		/* TODO: add 'frame bindings' init call method,
				for privatscope DOM update scheduling */

		requestAnimationFrame(frame)
	}
	function frame() {
		engine.STATS.frametime = performance.now() - engine.STATS.delta
		engine.STATS.delta = performance.now()

		const encoder = _device.createCommandEncoder()
		// Defered Drawcalls
		engine.pipeline.depthpass.draw(_device, _context)
		engine.pipeline.basepass.draw(encoder)
		engine.pipeline.shadowpass.draw(encoder)
		engine.pipeline.lightpass.draw(encoder)
		engine.pipeline.composepass.draw(encoder, _context)

		_device.queue.submit([encoder.finish()])

		requestAnimationFrame(frame)
	}
	return { init,}
})()