var timelineBlock = document.querySelector('.timeline-main');
var timelineMap = document.querySelector('.timeline-map');
var periodDates = [];
var extraTexts = [];
var svgIcons = [];

var render = function() {
    renderSVG();
    data.periods.forEach(function(period) {
        renderTitle(period.name, period.id);
        period.dates.forEach(function(data) {
            renderDate(data);
        })
    })
};

var createElement = function (text, className, wrapperClassName) {
    var el = document.createElement('div');
    if (wrapperClassName) {
        el.innerHTML = '<div class="' + wrapperClassName + '">' + text + '</div>'
    } else {
        el.innerText = text;
    }
    el.className = className;
    return el;
};

var renderSVG = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'images/map2_.svg');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            timelineMap.innerHTML = xhr.responseText;
            svgIcons = document.querySelectorAll('.svg-icon');
        }


    };
};

var renderTitle = function (name, id) {
    var el = document.createElement('div');
    el.className = 'period-date';
    if (id) {
        el.dataset.id = id;
    }
    el.appendChild(createElement(name, 'period-title'));
    timelineBlock.appendChild(el);
};

var renderDate = function(data) {
    var el = document.createElement('div');
    var date;
    var text;
    var picture = createElement('', 'date-picture');

    date = data.date
        ? el.appendChild(createElement(data.date, 'date', 'date-text'))
        : el.appendChild(createElement('', 'date date-empty'));

    if (data.extraText) {
        date.appendChild(createElement(data.extraText, 'extra-text'));
    }

    el.appendChild(date);

    if (data.picture) {
        picture.setAttribute('style', 'background-image: url("timeline/' + data.picture +'")');
    } else {
        picture.classList.add('dotted');
    }

    if (data.text) {
        text = createElement(data.text, 'text', 'text-wrapper');
        text.appendChild(picture);
        el.appendChild(text);
    }


    el.className = data.featured ? 'date-block featured' : 'date-block';

    timelineBlock.appendChild(el);

    periodDates = document.querySelectorAll('.period-date');
    extraTexts = document.querySelectorAll('.extra-text');
};

document.addEventListener("DOMContentLoaded", function() {
    render();
});

window.addEventListener('scroll', function() {
    var windowHeight = document.body.offsetHeight;


    extraTexts.forEach(function (extraText) {
        var top = extraText.getBoundingClientRect().top;
        if (top < 120) {
            extraText.setAttribute('style', 'opacity:0.7');
        }
        if (top < 60) {
            extraText.setAttribute('style', 'opacity:0.5');
        }
        if (top < 30) {
            extraText.setAttribute('style', 'opacity:0.3');
        }
        if (top > 120) {
            extraText.removeAttribute('style');
        }
    });

    periodDates.forEach(function(periodCont, i) {
        var top = periodCont.getBoundingClientRect().top;
        var nextTop;
        if (periodDates[i + 1]) {
            nextTop = periodDates[i + 1].getBoundingClientRect().top;
        }
        if (top < 100 && top > (- nextTop)) {
            periodCont.classList.add('fixed');
            var periodContId = periodCont.dataset.id;
            svgIcons.forEach(function(svgIcon) {
                svgIcon.classList.remove('active-icon');
            });

            if (periodContId) {
                document.getElementById(periodContId).classList.add('active-icon');
            }
        } else {
            periodCont.classList.remove('fixed');
        }
    })
});