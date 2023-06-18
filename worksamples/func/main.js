window.addEventListener("DOMContentLoaded", () => {

    
    //console.log(document.styleSheets[1])

})
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
        if(document.querySelector('#moddel') !== null) {
            media.cache.moddel.classList.add('fadeOut')
            setTimeout(() => {
                document.body.removeChild(media.cache.moddel)
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
        moddel : false,
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
            
            media.cache.image.style.backgroundImage = `url('img/${name}.png')`
            
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
    moddel : async (name) => {
        await overlay.load().then(() => {

            media.cache.moddel = document.createElement('iframe')
            media.cache.moddel.classList.add('overlay')
            media.cache.moddel.classList.add('media')

            media.cache.moddel.setAttribute('id', 'moddel')
            media.cache.moddel.setAttribute('height', `${media.height}px`)
            media.cache.moddel.setAttribute('width', `${media.width}px`)
            media.cache.moddel.setAttribute('framborder', '0')
            media.cache.moddel.setAttribute('src', 'https://sketchfab.com/models/ba7ab3443b8049fcb79f1389708a1494/embed')

            media.cache.moddel.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
            media.cache.moddel.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`
            media.cache.moddel.style.opacity = `0`

            document.body.appendChild(media.cache.moddel)

            media.cache.moddel.onload = () => {
                
                overlay.func()

                overlay.cache.background.classList.add('fadeIn')
                overlay.cache.func.classList.add('fadeIn')
                media.cache.moddel.classList.add('fadeIn')

                window.addEventListener("resize", () => {
                    media.cache.moddel.style.top = `${((document.documentElement.clientHeight-media.height)/2)+window.scrollY}px`
                    media.cache.moddel.style.left = `${(document.documentElement.clientWidth-media.width)/2}px`    
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