// TODO:

// layout
// nav

// TODO: 
	// add cookie loader lang,theme
	// ---
	// console.log(document.cookie)

	// add auto language based on system
	// ---
	// console.log(`system: ${navigator.language}`)

	// add themeselector
	// ---
	// console.log(document.styleSheets[1])
	// document.styleSheets[1].disabled = true

// DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
	
	// engine event listener
	if (engine) {

		engine.eventdispatcher.addEventListener('GPUEnabled', () => {
			document.querySelector('.event.GPUEnabled').style.visibility = 'visible'
		})

	}

})
