var createElement = function(text, className, wrapperClassName, params) {
    var el = document.createElement(params && params.type || 'div');
    if (wrapperClassName) {
        el.innerHTML = '<div class="' + wrapperClassName + '">' + text + '</div>'
    } else {
        el.innerText = text;
    }
    el.className = className;
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
    xhr.open("GET", 'svg/' + params.file);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            params.container.innerHTML = xhr.responseText;
            if (!params.noChangeStyle) params.container.style.display = 'flex';
        }
    };
};