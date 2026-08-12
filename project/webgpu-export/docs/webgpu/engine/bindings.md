# [WebGPU Export](./../../overview.md)
# [WebGPU](./../../overview.md#webgpu) 
## bindings
```
structure

    custom html atrribue  = instruction(target, eventmethod, arg)

    webgpuengine = 'bind(<<htmlobject>atribute/style>, <engine.binding>, <arg>)'
```
### instruction
bind  
<span style='color: orange;'>⚠ *note: only instruction currently*</span>
### target
html Attribute  
html Style  
### eventmethod
```
structure

    enginetarget . callmethod
```

.get = called once  
.set = updated on event executed

### arg
based on event