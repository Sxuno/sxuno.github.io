/* License
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.shader = engine.shader || {}
engine.shader.depth = engine.shader.depth || {}
engine.shader.depth.fragment = `
@group(0) @binding(0) var zBuffer: texture_2d<f32>;

override canvasSizeWidth: f32;
override canvasSizeHeight: f32;

@fragment
fn main(
	@builtin(position) coord: vec4f
) -> @location(0) vec4f {
	let c = coord.xy / vec2f(canvasSizeWidth, canvasSizeHeight);

	let rawDepth = textureLoad(
		zBuffer,
		vec2i(floor(coord.xy)),
		0
	).x;

	let depth = (1.0 - rawDepth) * 50.0;

	return vec4f(depth, depth, depth, 1.0);
}`
