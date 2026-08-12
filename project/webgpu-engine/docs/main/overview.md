# WebGPU engine

## Content

### types
```
*.js
```
### structure

+docs/content/[`info`](./content/info.md)  
+docs/content/cameras/[`cameras`](./content/cameras/camera.md)  
+docs/content/lights/[`lights`](./content/lights/light.md)  
+docs/content/materials/[`materials`](./content/materials/material.md)  
+docs/content/meshes/[`meshes`](./content/meshes/mesh.md)  

## Engine

### configuration
```c
<script> 
    engine.PATH.content = <string>      // DEFAULT './content/'
    engine.PATH.shader = <string>       // DEFAULT './engine/shader/'
</script>
```

### init
loadhandler(event)
#### default 
event 'load'
#### data-autoinit
```html
<script src = 'engine/core.js' data-autoinit = 'DOMContentLoaded'>
```
supported events:  
'DOMContentLoaded'  
'load'
#### override
```javascript
engine.init(args)
```
supports custom events

### log  
infos
```js
engine.log.infos = true
```
events
```js
engine.log.events = true
```
warnings
```js
engine.warnings = true
```
### eventdispatcher
```
engine.eventdispater.addEventlistener('event', () => {callback})
```
#### events
- 'InitCore'
- 'InitGPU'
- 'InitRuntime'

### structure
  
+docs/engine/[`core`](./engine/core.md)  
+docs/engine/[`gpu`](./engine/gpu.md)  
+docs/engine/[`runtime`](./engine/runtime.md)  

+docs/engine/pipeline/[`basepass`](./engine/pipline/basepass.md)  
+docs/engine/pipeline/[`composepass`](./engine/pipline/composepass.md)  
+docs/engine/pipeline/[`depthpass`](./engine/pipline/depthpass.md)  
+docs/engine/pipeline/[`lightpass`](./engine/pipline/lightpass.md)  
+docs/engine/pipeline/[`shadowpass`](./engine/pipline/shadowpass.md)  

+docs/engine/[scene](./engine/scene.md)  
+docs/engine/scene/[info](.engine/scene/info.md)  
+docs/engine/scene/[`data`](./engine/scene/data.md)  
+docs/engine/scene/[`graph`](./engine/scene/graph.md)  

+docs/engine/shader/[`shader`](./engine/shader/shader.md)  

+docs/engine/utils/[`math`](./engine/utils/math.md)  