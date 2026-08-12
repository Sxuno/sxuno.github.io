# [WebGPU Export](./../../overview.md)
# [WebGPU](./../../overview.md#webgpu) 
# content
# info 
content descriptor  
*- webgpu options*  
*- scene description*  
*- scene content*
## structure
<span style='color: orange;'>⚠ *note: currently subject to change.*</span>
### engine.scene.data.info.viewport = engine.scene.data.info.viewport || {}  
+docs/webgpu/[`options`](../options.md)  

### engine.scene.data.info.viewport.color = *vec3Uint*  
```scene/world/material/rgb```  

### engine.scene.data.info.viewport.alpha = *bool*  
```export/option/background```  

### engine.scene.data.info.camera = *string*  
```scene/camera/name ? missing = None Error >> exit export before execute```  
+docs/addon/objects/[`cameras`](../../addon/scene/objects/cameras.md)  

Solution: create camera in scene

### engine.scene.data.info.files = [Path:*objecttype/objectname*]  

+docs/webgpu/[`types`](../types.md)

+docs/addon/objects/[`meshes`](../../addon/scene/objects/meshes.md)  
```ts  
{ 		
    name                : <str>
	location            : <<vec3>float>
    rotation            : <<vec3>float>         //radian
    scale               : <<vec3>float>
    vertices            : <<vec3>float>
    vertex_materials    : <Uint32>
    indices             : <Uint32>
    materials           : <str>
    uv_coords			: <<vec2>float>
    normals             : <<vec3>float>
    edges               : <<vec2>float>
}  
```
+docs/addon/objects/[`materials`](../../addon/scene/objects/materials.md)  
```ts
{
    name                : <str>
    rgb                 : <<vec3>float>
    culling             : <bool>
}
```
+docs/addon/objects/[`lights`](../../addon/scene/objects/lights.md)  
```ts
{
    name                : <str>
    type                : <str>
    color               : <<vec3>float>
	location            : <<vec3>float>
    rotation            : <<vec3>float>         //radian
    scale               : <<vec3>float>
}
```