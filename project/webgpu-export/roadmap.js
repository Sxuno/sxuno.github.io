/* Roadmap */
window.api = {}
window.api.roadmap = {}
/*
if (window.location.protocol === 'file:') {}
elseif (window.location.protocol !== 'file:') {
	fetch('roadmap.json')
		.then(res => res.json())
		.then(json => {
			window.api.roadmap.data = json
		})
		.catch(console.error)
}
*/

window.api.roadmap.data = 
{
	'versions': 
	[
		{
		'label': 'Version 0.1.0dev',
		'rows': {
			'Integrations'  : ['Render Resolution', 'Mesh Data','Backface culling','Light Points','Background RGBA',],
			'Technologies'  : ['Device Setup', 'Renderpass', 'Deferred Rendering', 'Defered Lightning'],
			'Features'      : ['Export Generator','Html Distribution', 'Template Preview',]
			}
		},
		{
		'label': '2026 in development',
		'rows': {
			'Integrations'  : ['Material Color', 'Keyframes', 'Shadows', 'Pointclouds', 'Particlesytems'],
			'Technologies'  : ['RGB Shader', 'GPU-driven rendering', 'Draw call batching' ],
			'Features'      : ['Shading Modes', 'Multicanvas', 'Camera Movement', 'Debug View'],
			}
		},
		{
		'label': 'Future release',
		'rows': {
			'Integrations'  : ['Material Texture', 'Material Normals', 'Material Emissive', 'Material Roughness', 'Material Alpha', 'Particle Systems'],
			'Technologies'  : ['Texture Shader', 'Normalmap Shader', 'Forward Rendering', 'Instancing', 'Frame Interpolation', 'Virtual Shadow Map'],
			'Features'      : ['Template Showcase', 'Template Benchmark', 'Bounding Boxes', 'LOD System'],
			}
		}
	]
}
if (!window.api.roadmap.data) {throw new Error('Roadmap data missing')}

// ? Namespace roadmap.timeline.render is better
window.api.roadmap.render = function (data) {
	const timeline = document.querySelector('.timeline')
	if (!timeline) {return}
	timeline.innerHTML = ''

	data.versions.forEach(version => {
		const box = document.createElement('div')
		box.className = 'box'

		const label = document.createElement('label')
		label.textContent = version.label
		box.appendChild(label)

		for (const rowLabel in version.rows) {
		const row = document.createElement('div')
		row.className = 'row'

		version.rows[rowLabel].forEach(text => {
			const col = document.createElement('div')
			col.className = 'col'
			col.textContent = text
			row.appendChild(col)
		})
		box.appendChild(row)
		}
		timeline.appendChild(box)
	})
}

/* Runtime */
document.addEventListener('DOMContentLoaded', (event) => {
	// console.time(event.type)
		window.api.roadmap.render(window.api.roadmap.data)
	// console.timeEnd(event.type)
})