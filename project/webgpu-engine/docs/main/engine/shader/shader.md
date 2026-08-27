# [`WebGPU Engine`](./../../overview.md)  
# shader
## shared
### vertex strip quad
fullscreen quad to render offscreen textures on.
## depth
<span style='color: orange;'>⚠ *note: placeholder for debug view depth*</span>
## geometry
```
bindings:

    metadata : Metadata
    modelMatrices : array<mat4x4<f32>>
    materialSlot      : array<u32>
    materialSlotOffset: array<u32>
    materials: array<vec4<f32>>
```
## shadow
shadowpass for light masks
## light
lightpass shader for nLights
### fragment
```
bindings:

    gbuffer.albedo
    zbuffer
    linearSampler
    lights <storage, read>
    metadata <uniform>
```
## compose
### fragment
```
bindings:

    sampler
    albedoTexture
    lightTexture <storage, read>
    metadata <uniform>
```