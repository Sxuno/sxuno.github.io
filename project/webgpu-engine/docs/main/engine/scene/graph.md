# [`WebGPU Engine`](./../../overview.md)

## scene graph

### init
**internal:** dependency initializer / context initializer  
**runtime:** context loader
```js
engine.scene.graph.init()
```
note: runtime usage not yet supported.
#### loadhandler

### data
scene graph data object for gpu buffer  
*(invokes scene.resolver)*
```js
engine.scene.graph.data()

typeof context:
    string      << scene name
    number      << scene info id
    none
```
### desriptor
scene graph data index table  
*(invokes scene.resolver)*
```js
engine.scene.graph.data()

typeof context:
    string      << scene name
    number      << scene info id
    none
```