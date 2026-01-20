    // SEPERATE from layout.js as entrypoint for serialization
window.api = {} 
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