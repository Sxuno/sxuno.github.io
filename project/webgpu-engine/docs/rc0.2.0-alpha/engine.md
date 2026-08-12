# Engine

## init
eventlistener(event)
### default 
event 'load'
### data-autoinit
```html
<script src = 'engine/core.js' data-autoinit = 'DOMContentLoaded'>
```
supported events:  
'DOMContentLoaded'  
'load'
### override
```javascript
engine.init(args)
```
supports custom events

## PATH
configuration object for:
```
engine.PATH.shader = 'URI same Origin'    << default: ./engine/shader
engine.PATH.content = 'URI same Origin'   << default: ./content/
```

**Note:** *override before init only.*

## debug
**falg:** internal only | engine._debug

note: only use conditional.

log
```js
engine.debug?.log(string, object)
```
### timers
start
```
engine.debug?.timer.start(label)
```
time
```
engine.time(label)
```
end
```
engine.debug?.timer.end(label)
```
## log  
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
## eventdispatcher
```
engine.eventdispater.addEventlistener('event', () => {})
```
#### events
- 'InitCore'
- 'InitGPU'
- 'InitRuntime'