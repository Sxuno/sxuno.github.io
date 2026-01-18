function Request(type, target) {

    let html = document.createElement('div')
    html.className = type+' '+target
    document.body.appendChild(html)
}