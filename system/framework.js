// TODO: 
	// add themeselector
	// ---
	// console.log(document.styleSheets[1])
	// document.styleSheets[1].disabled = true

// ENGINE hooks
document.addEventListener('DOMContentLoaded', () => {
	
	// engine event listener
	if (engine) {

		engine.eventdispatcher.addEventListener('GPUEnabled', () => {
			document.querySelector('.event.GPUEnabled').style.visibility = 'visible'
		})

	}

})
// SYSTEM functions
system = (function () {
	const session = document.cookie
	const language = navigator.language
	const theme = 'default'
	const notification = null
	return {session, language, theme}
})()
// VIEW functions
view = (function() {
	let _cache
	let _index
	notification = (function() {
		const show = () => {}
		const hide = () => {}
		return {show, hide}
	})()
	container = (function() {
		let cache = {
			height : 315*2.5,
			width : 560*2.5
		}
		const show = () => {}
		const hide = () => {}
		const page = {
			next : () => {},
			prev : () => {}
		}
		return {show, hide, page}
	})()
	media = (function() {
		let cache = {
			image : false,
			model : false,
			video : false
		}
		const image = () => {}
		const model = () => {}
		const video = () => {}
		return {image, model, video}
	})()
	overlay = (function () {
		let cache = {
			background : false,
			func : false
		}
		const show = () => {}
		const hide = () => {}
		return {show, hide}
	})()
	return {container, media, overlay}
})()