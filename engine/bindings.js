/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

var _bindings = []

engine.bindings = engine.bindings || {}
engine.bindings.init = async function() {
        for (const entry of document.querySelectorAll('[webgpuengine]')) {
        _bindings.push(entry)
    }
}
engine.bindings.exec = function() {
    for (const entry of _bindings) {
        // proof of concept
        // TODO: 
            // ? add binding update frequency
            // move logic to binding.exec do a quick pars on regiter 
            // rethink namespace and call methods
        if (engine.STATS.gpu) {
            entry.style.visibility = 'visible'
        } else {
            entry.style.visibility = 'hidden'
        }
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