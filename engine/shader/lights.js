/* License
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.shader = engine.shader || {}
engine.shader.lights = engine.shader.lights || {}
engine.shader.lights.fragment = `
struct Light {
    location : vec3f,
    distance : f32,
    color : vec3f,
    power : f32,
};

struct Metadata {
    viewProj: mat4x4<f32>,
    canvasSize: vec2<f32>,
    lightNum: f32,
    background: vec4<f32>
};

@group(0) @binding(0) var gbufferAlbedo : texture_2d<f32>;
@group(0) @binding(1) var zbuffer : texture_depth_2d;
@group(0) @binding(2) var linearSampler : sampler;
@group(0) @binding(3) var<storage, read> lights : array<Light>;
@group(0) @binding(4) var<uniform> metadata: Metadata;

@fragment
fn main(@builtin(position) fragCoord : vec4f) -> @location(0) vec4f {
    let uv = fragCoord.xy / metadata.canvasSize;

    // Sample base color
    let albedo = textureSample(gbufferAlbedo, linearSampler, uv).rgb;

    // Sample depth
    let depth = textureLoad(zbuffer, vec2<i32>(fragCoord.xy), 0);
    if (depth == 1.0) {
        return vec4f(0.0);
    }

    // Normalized device coordinates
    let ndc = vec4f(
        fragCoord.xy / metadata.canvasSize * 2.0 - vec2f(1.0),
        depth * 2.0 - 1.0,
        1.0
    );
    let worldPosH = metadata.viewProj * ndc;
    let fragmentPos = worldPosH.xyz / worldPosH.w;

    var finalLight = vec3f(0.0);


    for (var i = 0u; i < u32(metadata.lightNum); i = i + 1u) {

        let intensity = lights[i].power; 
        let radius    = lights[i].distance;

        let toLight = lights[i].location - fragmentPos;
        let dist    = length(toLight);

        // inverse-square (physically plausible) with small epsilon
        let invSq = 1.0 / (dist * dist + 1e-4);

        // soft cutoff so it fades to zero near 'radius'
        let rangeFactor = clamp(1.0 - dist / radius, 0.0, 1.0);
        let attenuation = intensity * invSq * (rangeFactor * rangeFactor);

        finalLight = finalLight + lights[i].color * attenuation;
    }

    return vec4f(albedo * finalLight, 1.0);
}`
