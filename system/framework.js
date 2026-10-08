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

		const media = {
			load : (mediatype, source) => {},
			show : {},
			hide : {},
			remove : {}
		}
		const section = {
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
		return {media, section, slider}
	})()
	const overlay = {
		show : (contenttype, content) => {
			let overlay
			overlay = document.createElement('section')
			overlay.classList.add('overlay')
			overlay.setAttribute('onclick')

		},
		hide : () => {}
	}
	const notification = {
		loat : () => {}
	}
	return {content, overlay}
})()

const file = (function () {
	const load = () => {}

	return {load}
})()

const runtime = (function () {
	let _root = document.currentScript.src
	let _context

	let _style
	let _theme = [...document.styleSheets].find(sheet => sheet.href?.includes('/theme/')).href

	_theme = _theme.split('/')
	_theme = _theme[_theme.length-2]
	console.log(_theme)

	_style = new CSSStyleSheet()
	document.adoptedStyleSheets = [...document.adoptedStyleSheets, _style]

	const loadhandler = {
		media : () => {
			_context = document.querySelectorAll('div.media')
			if (_context.length) {
				for (let media of _context) {
					if(media.dataset.type) {
						let path = new URL(`../media/image/${media.id}.${media.dataset.type}`, _root)
						_style.insertRule(`#${CSS.escape(media.id)} { background-image: url("${path.href}"); }`)
					} else { console.warn(`media ${media.id} has no defined data-type`)}
				}
			} else { return }
		}
	}

	document.addEventListener('DOMContentLoaded', loadhandler.media)
})()