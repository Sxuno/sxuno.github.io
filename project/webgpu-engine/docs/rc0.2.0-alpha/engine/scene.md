# [`WebGPU Engine`](./../engine.md)

# scene

### init
**internal:** dependency initializer / context initializer  
**runtime:** context loader
```js
engine.scene.init()
```
note: runtime usage not yet supported.
#### loadhanlder

### resolver
scene filter for soa data structure.
```js
engine.scene.resolver(context)

typeof context:
    string      << scene name
    number      << scene info id
    none
```
## scene controller *[internal]*
entrypoint for module initialization

## scene data
structure
```js
engine.scene.data[ 
    {
        camera: [],
        light: [],
        material: [],
        mesh: [],
    }
]
```
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
*invokes scene.resolver()*
```js
engine.scene.graph.data()

typeof context:
    string      << scene name
    number      << scene info id
    none
```
### desriptor
scene graph data index table  
*invokes scene.resolver()*
```js
engine.scene.graph.data()

typeof context:
    string      << scene name
    number      << scene info id
    none
```