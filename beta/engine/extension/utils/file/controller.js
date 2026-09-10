// CONCEPT !!!

/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */

if(location.protocol === 'file:') {
    console.error('extension only supports server deployment.')
} else {

    engine.utils.file = {
        // may read / write instead
        load : (path) => {},
        import : (blobb) => {}, 
        export : (type) => {},

        types : ['blend', 'glft', 'glb', 'png', 'bmp', 'jpg'],
    }
}
