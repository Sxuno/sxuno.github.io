engine.bindings = engine.bindings || {}
    let _bindings = []
engine.bindings.exec = function() {
    for(const binding of _bindings) {
        console.log(_bindings)
    }
}
engine.binding = engine.binding || {}
engine.binding.visibility = function(htmlElement, engineElement) {
    htmlElement.setAttribute('visibility', engineElement)
    _bindings.push([htmlElement, engineElement])
}
engine.binding.innerText = function(htmlElement, engineElement) {
    htmlElement.innerText = engineElement
    _bindings.push([htmlElement, engineElement])
}