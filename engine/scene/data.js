/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.scene = engine.scene || {}
//   TODO: move scene data from global space to isolated space for improved lifecycle controll, or use var scene as lifecycle controller. dose need preformance tests.
engine.scene.data = (function () {
	const info = {
		files: [],		
		async init() {
			await new Promise((resolve) => {
				let script = document.createElement('script')
				script.src = 'content/info.js'
				script.onload = resolve	
				document.head.appendChild(script)
			})
		}
	}
	async function init() {
		// Entrypoint for filtered loading
		let seen = new Set()
		for (let src of engine.scene.data.info.files) {
			await new Promise((resolve) => {
				let [category] = src.split('/')
				if (!seen.has(category)) {
					engine.scene.data[category] = []
					seen.add(category)
				}
				let script = document.createElement('script')
				script.src = 'content/'+src+'.js'
				script.onload = resolve
				document.head.appendChild(script)
			})
		}		
	}
	return { init, info}
})()