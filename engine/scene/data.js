/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

// OBSOLETE 

engine.scene = engine.scene || {}
//   TODO: 
	// add lifecycle for data per scene to remove redundend loading
	// make it like scene.data.info[0] wich returns lookups maybe aswell metadata
engine.scene.data = (function () {
	const info = {
		viewport: {
			color : [],
			alpha : [],
		},
		camera : [],
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
		// TODO:
			// load based on scene
			// use 'seen' to prevent redundency
			// add hook to load by TYPE
			// rethink different defere scenarios
		let seen = new Set()
		for (let src of engine.scene.data.info.files[0]) {
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