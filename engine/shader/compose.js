/* License
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.shader = engine.shader || {}
engine.shader.compose = engine.shader.compose || {}
engine.shader.compose.fragment = `
struct Metadata {
    viewProj: mat4x4<f32>,
    canvasSize: vec2<f32>,
    lightNum: f32,
    meshNum: f32,
    background: vec4<f32>
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var albedoTexture: texture_2d<f32>;
@group(0) @binding(2) var lightTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> metadata : Metadata;

@fragment
fn main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
	let texSize = vec2<f32>(textureDimensions(albedoTexture));
	let uv = fragCoord.xy / texSize;

	let albedoSample = textureSample(albedoTexture, mySampler, uv);
	let lightSample = textureSample(lightTexture, mySampler, uv);

	// Combine colors using alpha from albedo and light
	let color = albedoSample.rgb + lightSample.rgb * lightSample.a;
	let alpha = max(albedoSample.a, lightSample.a);

	// Blend with metadata.background including alpha
	let finalColor = color * alpha + metadata.background.rgb * metadata.background.a * (1.0 - alpha);
	let finalAlpha = alpha + metadata.background.a * (1.0 - alpha);

	return vec4<f32>(finalColor, finalAlpha);
}`
