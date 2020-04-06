var createElement = function(text, className, wrapperClassName, params) {
    var el = document.createElement(params && params.type || 'div');
    if (wrapperClassName) {
        el.innerHTML = '<div class="' + wrapperClassName + '">' + text + '</div>'
    } else {
        el.innerHTML = text;
    }
    if (className) {
        el.className = className;
    }
    if (params && params.attrs) {
        params.attrs.forEach(function(attr) {
            el.setAttribute(attr[0], attr[1]);
        })
    }
    return el;
};

var createImg = function(src, className) {
    var el = document.createElement('img');
    el.setAttribute('src', 'books/' + src);
    el.className = className;
    return el;
};

var getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

var renderSVG = function(params) {
    var xhr = new XMLHttpRequest();
    var mainSvg = null;
    var container = params.container;
    var fn = params.fn;
    var parameters = params.params;
    var noChangeStyle = params.noChangeStyle;


    xhr.open("GET", 'svg/' + params.file);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            if (container) {
                container.innerHTML = xhr.responseText;
                mainSvg = container.querySelector('svg');
                if (fn) {
                    console.log('========================');
                    fn({ svg:mainSvg, el:container, params:parameters });
                }
                if (!noChangeStyle) {
                    container.style.display = 'flex';
                }
            }
        }
    };
};