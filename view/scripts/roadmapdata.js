    // SEPERATE from layout.js as entrypoint for serialization
    
    window.api.roadmap.data = 
    {
        'versions': 
        [
            {
            'label': 'Version 0.1.0dev',
            'rows': {
                'Integrations'  : ['Render Resolution', 'Mesh Data'],
                'Technologies'  : ['Device Setup', 'Renderpass'],
                'Features'      : ['Export Generator','Standalone Distribution']
                }
            },
            {
            'label': 'in development',
            'rows': {
                'Integrations'  : ['Material Color', 'Backface culling', 'Background RGB', 'Light Points', 'Keyframes', 'Shadows',],
                'Technologies'  : ['RGB Shader','Deferred Rendering', 'Defered Lightning', 'GPU-driven rendering', 'Draw call batching' ],
                'Features'      : ['Template Preview', 'Shading Modes', 'Multicanvas', 'Camera Movement', 'Debug View'],
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