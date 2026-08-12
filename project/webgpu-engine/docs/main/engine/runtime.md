# [`WebGPU Engine`](./../overview.md)  

# runtime

### init
**internal:** dependency initializer / context initializer  
**runtime:** context loader
```js
engine.runtime.init()
```
note: runtime usage not yet supported.
#### loadhanlder

### descriptor
runtime context index table
*(invokes scene.resolver)*
```js
engine.runtime.descriptor()

typeof context:
    string      << scene name
    number      << scene info id
    none
```