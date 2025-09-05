/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */
engine.bindings = engine.bindings || {}
    let _bindings = []
engine.bindings.exec = function() {
    for(const binding of _bindings) {
        console.log(_bindings)
    }
}
engine.binding = engine.binding || {}
engine.binding.visibility = function(htmlElement, engineElement, inverse) {
    _bindings.push([htmlElement, engineElement, inverse])
    htmlElement.innerText = inverse ? -engineElement : engineElement 
}
engine.binding.innerText = function(htmlElement, engineElement) {
    htmlElement.innerText = engineElement
    _bindings.push([htmlElement, engineElement])
}