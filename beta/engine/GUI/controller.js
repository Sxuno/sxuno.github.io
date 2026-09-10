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
	let _layouts
	let _elements

	// ======
	// PUBLIC
	// ======

	const init = (function() {
		// init dependencies
		engine.log.event('init GUI')
		engine.eventdispatcher.dispatchEvent(new Event('InitGUI'))

		_descriptor = new Array()
		_elements = new Array()
		_layouts = new Array()

		// note style controller gets style info from layout
		_styles = new Array()

		_readystate = 1 // TEST SWITCH
		async function loadhandler(context){
			// context loader  // .add gui config hook
			if(!_readystate) {
				if(engine.debug) {
					console.error('#debug')
				}
				_readystate = 1
			} else {
				// runtimehook
				if(context) {
					/* expect GUI context class
					{ context : {type : string, name : string, parent?: id, nodes?: id}} */
					await engine.utils.scr.load(engine.PATH.root+`GUI/${context.type}/${context.name}.js`)
					 // typebased switch
					switch(context.type) {
						case 'layout':
							_layouts.push(context)
							_descriptor.push(context)
							break
						case 'element':
							
							if(!context.parent) {
								_layouts.push(context)
								_descriptor.push(context)
								_descriptor[_descriptor.length-1]['nodes'] = null
								break
							}
							_elements.push(context)
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

	const layout = {}

	const element = {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let GUI = {
		init,
		element,
		layout
	}
	// CONDITIONAL
	// RETURN VAR
	return GUI
})()