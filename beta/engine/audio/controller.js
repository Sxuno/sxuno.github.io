/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.audio = engine.audio || {}
engine.audio.controller = (function(){

	// =======
	// PRIVATE
	// =======
    let _buffer

    let _context
    let _analyser
	let _dataArray
    
    let _isReady

    let _audioOut

	let _readystate

    const update = () => {
        if (!_isReady) return
        _analyser.getByteFrequencyData(_dataArray)
    }

    function getFrequencyRange(startBin, endBin) {
        if (!_isReady) return 0
        let sum = 0
        for (let i = startBin; i <= endBin; i++) {
            sum += _dataArray[i]
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
            if(!_audioOut) {
                _audioOut = await navigator.mediaDevices.selectAudioOut()
            }
            console.log(_audioOut)
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
		// init
		engine.log.event('init audio controller')
		engine.eventdispatcher.dispatchEvent(new Event('InitAudioController'))
		async function loadhandler(audio){
			// context loader
			if (!_readystate) {
                _context = new (window.AudioContext || window.webkitAudioContext)()
                _analyser = _context.createAnalyser()
                _analyser.fftSize = 256
                _dataArray = new Uint8Array(_analyser.frequencyBinCount)
				_readystate = true
			} else {
				// runtimehook
			}
		}
		return loadhandler
	})()

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let controller = {
		init: init,
        input : input,
        out : out
	}
	// IF FEATURESET VAR.FEATURE
	// RETURN VAR
	return controller

})()