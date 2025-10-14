/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.scene = engine.scene || {}
engine.scene.graph = (function() {
	let _raw = {}
	let _data = {} // for later

	async function init() {
		_raw.camera = engine.scene.data.camera.find(camera => camera.name === engine.scene.info[0].camera) // hardcoded for now
		_raw.meshes = engine.scene.data.mesh
		_raw.materials = engine.scene.data.material
		_raw.lights = engine.scene.data.light
		/* TODO:
			per scene
			frame aware
		*/
	}
	function raw() { return _raw }
	return { init, raw}
})()