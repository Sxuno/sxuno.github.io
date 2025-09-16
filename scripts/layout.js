// TODO: 
    // Rework into dataorianted reusable methods

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

/* Roadmap */
window.api = {}
window.api.roadmap = {}
/*if (window.location.protocol === 'file:') {*/
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
    if (!window.api.roadmap.data) {throw new Error('Roadmap data missing')}
/*}

if (window.location.protocol !== 'file:') {
    fetch('roadmap.json')
        .then(res => res.json())
        .then(json => {
            window.api.roadmap.data = json
        })
        .catch(console.error)
}
*/

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


/* lightbox for image, video and embeded sketchfab model  */
function scroll(bool) {
    if(bool == false) {
        let scrollTop = window.scrollY || document.documentElement.scrollTop
        let scrollLeft = window.scrollX || document.documentElement.scrollLeft
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop)
        }
    }
    if(bool == true) {
        window.onscroll = function() {}
    }
}
var overlay = {
    cache : { 
        background : false,
        func : false
    },
    func : () => {
        overlay.cache.func = document.createElement('div')
        overlay.cache.func.classList.add('overlay')
        overlay.cache.func.classList.add('func')
        overlay.cache.func.setAttribute('onclick', 'overlay.unload()')

        overlay.cache.func.style.position = 'absolute'
        overlay.cache.func.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY-11}px`
        overlay.cache.func.style.right = `${((document.documentElement.clientWidth-media.width)/2)-14}px`

        overlay.cache.func.innerHTML = `x`

        document.body.appendChild(overlay.cache.func)

        window.addEventListener("resize", () => {
            overlay.cache.func.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY-11}px`
            overlay.cache.func.style.right = `${((document.documentElement.clientWidth-media.width)/2)-14}px`
        })        
    },
    load : () => { 
        return new Promise((resolve) => { 
            scroll(false)

            overlay.cache.background = document.createElement('div')   
            overlay.cache.background.classList.add('overlay')     
            overlay.cache.background.setAttribute('onclick', 'overlay.unload()')
            
            overlay.cache.background.style.height = `${document.documentElement.clientHeight}px`
            overlay.cache.background.style.width = `${document.documentElement.clientWidth}px`
            overlay.cache.background.style.opacity = `0`

            overlay.cache.background.style.top = `${window.scrollY}px`

            document.body.appendChild(overlay.cache.background)

            window.addEventListener("resize", () => {
                overlay.cache.background.style.height = `${document.documentElement.clientHeight}px`
                overlay.cache.background.style.width = `${document.documentElement.clientWidth}px`
                overlay.cache.background.style.top = `${window.scrollY}px`
            })
            resolve()
        })
    },
    unload : () => {
        overlay.cache.background.removeAttribute('onclick')
        overlay.cache.background.classList.add('fadeOut')
        overlay.cache.func.removeAttribute('onclick')
        overlay.cache.func.classList.add('fadeOut')
        setTimeout(() => {
            document.body.removeChild(overlay.cache.background)
            document.body.removeChild(overlay.cache.func)
        }, 1600)        
        if(document.querySelector('#image') !== null) {
            media.cache.image.classList.add('fadeOut')
            setTimeout(() => {
                document.body.removeChild(media.cache.image)
            }, 1600)
        }
        if(document.querySelector('#model') !== null) {
            media.cache.model.classList.add('fadeOut')
            setTimeout(() => {
                document.body.removeChild(media.cache.model)
            }, 1600)
        }
        if(document.querySelector('#video') !== null) {
            media.cache.video.classList.add('fadeOut')
            setTimeout(() => {
                document.body.removeChild(media.cache.video)
            }, 1600)
        }
        scroll(true)
    }
}
var media = {
    cache : {
        image : false,
        model : false,
        video : false
    },
    height: 315*2.5,
    width: 560*2.5,
    image : async (name) => {
            await overlay.load().then(() => {
            
            media.cache.image = document.createElement('div')
            media.cache.image.classList.add('overlay')
            media.cache.image.classList.add('media')

            media.cache.image.setAttribute('id', 'image')

            media.cache.image.style.height = `${media.height}px`
            media.cache.image.style.width = `${media.width}px`
            media.cache.image.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
            media.cache.image.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`
            
            media.cache.image.style.backgroundImage = `url('./../../media/image/${name}.png')`
            
            document.body.appendChild(media.cache.image)

            overlay.func()

            overlay.cache.background.classList.add('fadeIn')
            overlay.cache.func.classList.add('fadeIn')
            media.cache.image.classList.add('fadeIn')            

            window.addEventListener("resize", () => {
                media.cache.image.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
                media.cache.image.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`   
            }) 
        })
    },
    model : async (name) => {
        await overlay.load().then(() => {

            media.cache.model = document.createElement('iframe')
            media.cache.model.classList.add('overlay')
            media.cache.model.classList.add('media')

            media.cache.model.setAttribute('id', 'model')
            media.cache.model.setAttribute('height', `${media.height}px`)
            media.cache.model.setAttribute('width', `${media.width}px`)
            media.cache.model.setAttribute('framborder', '0')
            media.cache.model.setAttribute('src', 'https://sketchfab.com/models/ba7ab3443b8049fcb79f1389708a1494/embed')

            media.cache.model.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
            media.cache.model.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`
            media.cache.model.style.opacity = `0`

            document.body.appendChild(media.cache.model)

            media.cache.model.onload = () => {
                
                overlay.func()

                overlay.cache.background.classList.add('fadeIn')
                overlay.cache.func.classList.add('fadeIn')
                media.cache.model.classList.add('fadeIn')

                window.addEventListener("resize", () => {
                    media.cache.model.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
                    media.cache.model.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`    
                }) 
            }   
        })
    },
    video : async (name) => {
        await overlay.load().then(() => {

            media.cache.video = document.createElement('iframe')
            media.cache.video.classList.add('overlay')        
            media.cache.video.classList.add('media')

            media.cache.video.setAttribute('id', 'video')
            media.cache.video.setAttribute('height', `${media.height}px`)
            media.cache.video.setAttribute('width', `${media.width}px`)
            media.cache.video.setAttribute('framborder', '0')
            media.cache.video.setAttribute('src', 'https://www.youtube.com/embed/8atRYanX8yk?modestbranding=1&rel=0&showinfo=0')

            media.cache.video.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
            media.cache.video.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`
            media.cache.video.style.opacity = `0`            
            
            document.body.appendChild(media.cache.video)

            media.cache.video.onload = () => {
                
                overlay.func()

                overlay.cache.background.classList.add('fadeIn')
                overlay.cache.func.classList.add('fadeIn')
                media.cache.video.classList.add('fadeIn')

                window.addEventListener("resize", () => {
                    media.cache.video.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
                    media.cache.video.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`    
                }) 
            }
        })
    }
}
/* Runtime */
document.addEventListener('DOMContentLoaded', (event) => {
    // console.time(event.type)
        window.api.roadmap.render(window.api.roadmap.data)
    // console.timeEnd(event.type)
})