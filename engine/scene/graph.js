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
		_raw.camera = engine.scene.data.cameras.find(camera => camera.name === engine.scene.data.info.camera)
		_raw.meshes = engine.scene.data.meshes
		_raw.materials = engine.scene.data.materials
		_raw.lights = engine.scene.data.lights
	}
	function raw() { return _raw }
	return { init, raw}
})()