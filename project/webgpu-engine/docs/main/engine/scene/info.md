# [`WebGPU Engine`](./../../overview.md)  
## scene info
structure
```js
engine.scene.info[ 
    {
        name: <string>,
        camera: <string>,
        content: [
            camera : {
                id: <number>,
                name: <string>,
            },
            light : [
                {
                    id: <number>,
                    name: <string>,
                }
            ],
            material : [
                {
                    id: <number>,
                    name: <string>,
                }
            ],
            mesh : [
                {
                    id: <number>,
                    name: <string>,
                }
            ]
        ],
        files: [ <string> ],
        viewport : {
            alpha : <bool>,
            color : [<vec3>]
        }
    }
]
```