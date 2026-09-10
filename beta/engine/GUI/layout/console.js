/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.GUI.widget.console = (function(){
	
	// =======
	// PRIVATE
	// =======

	let _readystate

	let _index
	let _style
	let _elements

	/* CONCEPT

		<gui>
			<scrollbox>
			<promt></promt>
		</gui>

	*/

	// ======
	// PUBLIC
	// ======

	class Console {} // init({style, [elements]})

	const init = () => {
		/* gui.init(stye, [elements]) */
	}
	const style = () => {return _style}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let console = {
		init,
		style,
		prototype : Console
	}
	// CONDITIONAL
	// RETURN VAR
	return console
})