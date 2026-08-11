/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI = engine.GUI || {}
engine.GUI.widget = engine.GUI.widget || {}
engine.GUI.widget.console = (function(){
    let init
    let show
    let hide

    let console = {
        init,
        show,
        hide
    }

    return console
})