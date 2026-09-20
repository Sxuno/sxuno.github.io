/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.audio = (function(){

	// =======
	// PRIVATE
	// =======

    let _readystate

    let _dependencies
	let _loadhandler
	let _runtimehook 

    let _buffer

    let _context
    let _analyser
    
    let _active

    let _channel

    const update = () => {
        if (!_active) return
        _analyser.getByteFrequencyData(_buffer)
    }

    function getFrequencyRange(startBin, endBin) {
        if (!_active) return 0
        let sum = 0
        for (let i = startBin; i <= endBin; i++) {
            sum += _buffer[i]
        }
        // Normalized return
        return sum / (endBin - startBin + 1) / 255; 
    }

    async function audioOut() {
        try {
            if (!navigator.mediaDevices.selectAudioOut) {
                console.info('feature sound channel selection not available.')
                return
            }
            if(!_channel) {
                _channel = await navigator.mediaDevices.selectAudioOut()
            }
            console.log(_channel)
        } catch (error) {
            console.error('hardware list locked:', error)
        }
    }

	// ======
	// PUBLIC
	// ======

    const input = {}
    const out = {}

	const init = (function() {
		// DEPENDENCIES
		engine.log.event('init audio')
		engine.eventdispatcher.dispatchEvent(new Event('InitAudioController'))
		async function loadhandler(audio){
			// LOADHANDLER
			if (_readystate) {
                // RUNTIMEHOOK
			} else {
				// CONFIGURATION
                _context = new (window.AudioContext || window.webkitAudioContext)()
                _analyser = _context.createAnalyser()
                _analyser.fftSize = 256
                _buffer = new Uint8Array(_analyser.frequencyBinCount)
				_readystate = true
			}
		}
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let audio = {
		init: init,
        input : input,
        out : out
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return audio

})()