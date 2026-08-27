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

	// Definition : 
	// 		an widget is an gui group anchor element 
	//		an element is an gui privat logic primitive
	// 		an widget contains elements
	//		an widget can contain node widgets
	//		an widget can control an widget
	//		an widget can control an element
	//		an element contains logic
	// 		an element can contain node widgets
	// 		an element can contain node elements
	//		an element cant control an widget
	//		an element cant control an element

	let _descriptor // [{widgets [elements]}]

	let _widgets
	let _elments

	let _readystate

	// # - redundency tracker
	async function load(src) {
		await new Promise((resolve) => {
			let script = document.createElement('script')
			script.src = src
			script.onload = resolve
			script.onerror = resolve
			document.head.appendChild(script)
		})
	}

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies
		engine.log.event('init GUI')
		engine.eventdispatcher.dispatchEvent(new Event('InitGUI'))
		_readystate = true // TEST SWITCH
		async function loadhandler(context){
			// context loader  // .add gui config hook
			if(!_readystate) {
				_readystate = true
			} else {
				// runtimehook
				if(context) {
					/* expect GUI context class
					{ context : {type : string, name : string, parent?: id, nodes?: id}} */
					load(engine.PATH.root+`GUI/${context.type}/${context.name}.js`)
					_descriptor = _descriptor || new Array
					 // typebased switch
					switch(context.type) {
						case 'widget':
							_widgets = _widgets || new Array
							_widgets.push(context)
							_descriptor.push(context)
							break
						case 'element':
							
							if(!context.parent) {
								_widgets = _widgets || new Array
								_widgets.push(context)
								_descriptor.push(context)
								_descriptor[_descriptor.length-1]['nodes'] = null
								break
							}
							_elments = _elments || new Array
							_elments.push(context)
							_descriptor[context.parent].push(context)
							break
						default:
							console.log(`GUI type ${context.type} not supported.`)
					}
					console.log(_descriptor)
				}
			}
		}
		return loadhandler
	})()

	const controller = {
		init : (function() {
			// init
			engine.log.event('init GUI controller')
			async function loadhandler(module){
				// context loader // .add gui path hook
			}
			return loadhandler
		})()
	}

	const widget = {}

	const element = {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let GUI = {
		init,
		element,
		widget
	}
	// CONDITIONAL
	// RETURN VAR
	return GUI
})()