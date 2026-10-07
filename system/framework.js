// FRAMEWORK
// sample for webgpu engine integration
// version 0.2.0-alpha

// BASIC SETUP

// ENGINE hooks
document.addEventListener('DOMContentLoaded', () => {
	
	// engine signal receiver
	if (engine) {
		// class based
		engine.eventdispatcher.addEventListener('GPUEnabled', () => {
			let vdom = document.querySelectorAll('.event.GPUEnabled')
			for (let i = 0; i < vdom.length; i++) {
				vdom[i].style.visibility = 'visible'
			}
		})
	}

	const test = document.querySelector('#test')
	if(test) {
		let s = test.getBoundingClientRect()
		console.log(s.width)
		console.log(test.children)
	}
})

// SYSTEM functions
const system = (function () {
	const session = document.cookie
	const language = navigator.language
	const theme = 'default'
	const notification = null
	return {session, language, theme}
})()

// RESPONSIVE functions
const responsive = (function() {
	let _observer
	let _width
	let _height

	_width = window.innerWidth
	_height = window.innerHeight
	console.log(`document onscreensize ${_width} x ${_height}`)
})()

// VIEW functions
const view = (function () {
	let _vdom
	const content = (function(){
		let _section
		let _overlay
		let _slider

		const section = {
			load : {},
			show : {},
			hide : {},
			remove : {}
		}
		const overlay = {
			load : {},
			show : {},
			hide : {},
			remove : {}
		}
		const slider = {
			load : {},
			show : {},
			hide : {},
			remove : {}
		}

		return {section, overlay, slider}
	})()
	return {content}
})()