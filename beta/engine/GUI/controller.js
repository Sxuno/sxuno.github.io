/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI = (function() {

	// =======
	// PRIVATE
	// =======

	let _readystate

	let _dependencies
	let _loadhandler
	let _runtimehook 

	let _descriptor // [{layout [element]}]

	let _styles
	let _parents
	let _attributes
	let _elements
	let _index

	const controller = {
		init : (function() {
			// init
			engine.log.event('init GUI controller')
			async function loadhandler(){
				// context loader // .add gui path hook
			}
			return loadhandler
		})
	}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// dependencies
		engine.log.event('init GUI')
		engine.eventdispatcher.dispatchEvent(new Event('InitGUI'))

		_descriptor = new Array()
		_elements = new Array()

		//  style info from layout
		_styles = new Array()

		async function loadhandler(context){
			// loadhandler
			if(_readystate) {
				// runtimehook
			} else {
				// context init
				if(engine.debug || engine.config?.console) {
					await engine.utils.scr.load(engine.PATH.root+`GUI/element/console.js`)
				}
				_readystate = 1
			}
		}
		return loadhandler
	})()

	const register = (element) => {
		console.log('register HTML Element to GUI')
		let html 
		html = document.createElement(element.type)
		for (let a = 0; a < element.attributes.length; a++) {
			html[element.attributes[a]] = element.value[a]
		}
		/*
		for (let s = 0; s < element.style.length; s++) {
			_styles.push(element.style[s]) // check for existing for .update .instancecount
		}
		*/
		// TODO: bad solution replace with => recursive child parent relation construction with pointer lifecycle
		let parent
		parent = document.querySelectorAll(element.parent)
		parent.append(html)
	}

	const element = {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let GUI = {
		init,
		element,
	}
	// CONDITIONAL
	// RETURN VAR
	return GUI
})()