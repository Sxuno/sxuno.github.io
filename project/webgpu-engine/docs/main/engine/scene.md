# [`WebGPU Engine`](./../overview.md)

## scene

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