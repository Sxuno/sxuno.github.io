/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

// TODO: 
    // structe for user workspace 
    // move dependencies to engine.core.init
    // only allow func exection of listed functions in this file
var _htmlElements = []
var _bindings = []

engine.bindings = engine.bindings || {}
engine.bindings.init = async function() {
    for (const entry of document.querySelectorAll('[webgpuengine]')) {
        _htmlElements.push(entry)
        let _instructionset = entry.getAttribute('webgpuengine')
        _bindings.push(_instructionset.split(/[(),]/).map(args => args.trim()).filter(Boolean))
    }
}
engine.bindings.get = function() {console.table(_bindings) /* return _bindings */}
engine.bindings.exec = function() {
    console.log(_bindings)
    /* TESTFUNCTION
    for (const entry of _bindings) {
        // proof of concept
        // TODO: 
            // ? add binding update frequency
            // move logic to binding.exec 
            // ? do a quick pars on regiter 
        if (engine.STATS.gpu) {
            entry.style.visibility = 'visible'
        } else {
            entry.style.visibility = 'hidden'
        }
    }
    */
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