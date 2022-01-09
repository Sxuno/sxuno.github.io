// functions
function show(name) {
    document.getElementById(name).style.display = "block";
}
function hide(name) {
    document.getElementById(name).style.display = "none";
}
function js_ani(name, handler, trigger) {
    // definitions
    // routine
    switch(handler) {
        case "button":
            switch(trigger) {
                case "enter":
                    buttoneter = setTimeout(function(){show(name)}, 100);
                    if(typeof menuleave !== 'undefined') {clearTimeout(menuleave);};
                    break;
                case 'leave':
                    buttonleave = setTimeout(function(){hide(name)}, 100);
                    break;
            }
            break;
        case 'menu':
            switch(trigger) {
                case "enter":
                    menuenter = setTimeout(function(){show(name)}, 100);
                    if(typeof buttonleave !== 'undefined') {clearTimeout(buttonleave);};
                    break;
                case "leave":
                    menuleave = setTimeout(function(){hide(name)}, 100);
                    if(typeof buttonenter !== 'undefined') {clearTimeout(menuleave);};
                    break;
            }
            break;
    }
}