/* License
 *
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
@vertex
fn main(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4f {
    var uv = vec2f(f32((idx << 1) & 2), f32(idx & 2));
    return vec4f(uv * 2.0 - 1.0, 0.0, 1.0);
}