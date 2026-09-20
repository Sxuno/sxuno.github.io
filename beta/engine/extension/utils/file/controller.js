/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

// CONCEPT !!!

if(location.protocol === 'file:') {
    console.error('extension only supports server deployment.')
} else {

    engine.utils.file = (function() {

        // =======
        // PRIVATE
        // =======

        let _readystate

        let _cache
        
        const format = { 
            blend : {},
            gltf : {},
            glb : {},
            usd : {},
            // wgsl?
        }
        const controller = []

        // ======
        // PUBLIC
        // ======

        const load = (path) => {}
        const read = (blobb) => {}
        const write = (file) => {}

        // ======
        // EXPORT
        // ======

        // Declare var
        let file = {
            load,
            read,
            write
        }
        // CONDITIONAL
	    // RETURN VAR
        return file
    })()
}
