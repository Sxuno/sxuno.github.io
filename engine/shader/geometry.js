/* License
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.shader = engine.shader || {}
engine.shader.geometry = engine.shader.geometry || {}
engine.shader.geometry.fragment = `
struct VertexOut {
    @builtin(position) Position : vec4<f32>,
    @location(0) color : vec4<f32>,
};

fn tonemap(x: vec3<f32>) -> vec3<f32> {
    // Khronos neutral (AgX) tonemapper
    let A = 0.22;
    let B = 0.30;
    let C = 0.10;
    let D = 0.20;
    let E = 0.01;
    let F = 0.30;

    let numerator = x * (A * x + C * B) + D * E;
    let denominator = x * (A * x + B) + D * F;
    let result = (numerator / denominator) - (E / F);

    return clamp(result, vec3<f32>(0.0), vec3<f32>(1.0));
}

fn toSRGB(rgb: vec3<f32>) -> vec3<f32> {
    return pow(rgb, vec3<f32>(1.0 / 2.2));
}

@fragment
fn main(input: VertexOut) -> @location(0) vec4<f32> {
    let linear = input.color.rgb;
    let agxColor = tonemap(linear);
    let finalColor = toSRGB(agxColor);
    return vec4<f32>(finalColor, input.color.a);
}`
engine.shader.geometry.vertex = `
struct Metadata {
    viewProj: mat4x4<f32>,
    canvasSize: vec2<f32>,
    lightNum: f32,
    background: vec4<f32>
};

@group(0) @binding(0) var<uniform> metadata : Metadata;
@group(0) @binding(1) var<storage, read> modelMatrices : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read> materialSlot      : array<u32>;
@group(0) @binding(3) var<storage, read> materialSlotOffset: array<u32>;
@group(0) @binding(4) var<storage, read> materials: array<vec4<f32>>;

struct VertexIn {
	@location(0) position        : vec3<f32>,
	@location(1) vertexMaterial  : u32,
};

struct VertexOut {
	@builtin(position) Position : vec4<f32>,
	@location(0) color : vec4<f32>,
};

@vertex
fn main(input: VertexIn, @builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> VertexOut {
    var out : VertexOut;

	let model : mat4x4<f32> = modelMatrices[instanceIndex];
	out.Position = metadata.viewProj * (model * vec4<f32>(input.position, 1.0));
    out.color = materials[materialSlot[materialSlotOffset[instanceIndex]]];

	return out;
}`
