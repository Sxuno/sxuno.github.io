/* License
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.shader = engine.shader || {}
engine.shader.shared = engine.shader.shared || {}
engine.shader.shared.vertex = engine.shader.shared.vertex || {}
engine.shader.shared.vertex.strip = engine.shader.shared.vertex.strip || {}
engine.shader.shared.vertex.strip.quad = `
@vertex
fn main(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4f {
    var uv = vec2f(f32((idx << 1) & 2), f32(idx & 2));
    return vec4f(uv * 2.0 - 1.0, 0.0, 1.0);
}`
