var timelineBlock = document.querySelector('.timeline-main');
var periodDates = [];
var scrolledTitles = [];

var render = function() {
    console.log(data.periods);
    data.periods.forEach(function(period) {
        renderTitle(period.name);
        period.dates.forEach(function(data) {
            renderDate(data);
        })
    })
};

var createElement = function (text, className, elem) {
    var el = document.createElement('div');
    if (elem) {
        el.innerHTML = '<div class="date-text">' + text + '</div>'
    } else {
        el.innerText = text;
    }
    el.className = className;
    return el;
};

var renderTitle = function (name) {
    var el = document.createElement('div');
    el.className = 'period-date';
    el.appendChild(createElement(name, 'period-title'));
    timelineBlock.appendChild(el);
};

var renderDate = function(data) {
    var el = document.createElement('div');
    var date;

    date = data.date
        ? el.appendChild(createElement(data.date, 'date', 'wrap'))
        : el.appendChild(createElement('', 'date date-empty'));

    if (data.extraText) {
        date.appendChild(createElement(data.extraText, 'extra-text'));
    }

    el.appendChild(date);

    if (data.text) {
        el.appendChild(createElement(data.text, 'text'));
    }

    el.className = data.featured ? 'date-block featured' : 'date-block';

    timelineBlock.appendChild(el);

    periodDates = document.querySelectorAll('.period-date');
};

document.addEventListener("DOMContentLoaded", function() {
    render();
});

window.addEventListener('scroll', function() {
    var windowHeight = document.body.offsetHeight;

    console.log(pageYOffset);
    console.log(document.body.offsetHeight);
    console.log('periodDates::', periodDates);
    periodDates.forEach(function(periodCont, i) {
        var top = periodCont.getBoundingClientRect().top;
        var nextTop;
        if (periodDates[i + 1]) {
            nextTop = periodDates[i + 1].getBoundingClientRect().top;
        }

        console.log('TOP::', top, nextTop);

        if (top < 100 && top > (- nextTop)) {
            periodCont.classList.add('fixed');
            // scrolledTitles.push(periodCont);
        } else {
            periodCont.classList.remove('fixed');
        }
    })
});