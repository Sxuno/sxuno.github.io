# [WebGPU Export](./../overview.md)  
# WebGPU
# Shader

### Serialization
WGSL files will be serialized into javascript files. 
Base folder within 'engine/shader' determains the javascript filename and namespace,
the filename will become the var name containing the shader code.
Multiple files within the base folder structure will be combined.

+docs/webGPU/engine/[`shader`](./engine/shader.md)  