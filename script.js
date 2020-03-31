var timelineBlock = document.querySelector('.timeline-main');

var render = function() {
    console.log(data.periods);
    data.periods.forEach(function(period) {
        period.dates.forEach(function(data) {
            renderDate(data);
        })
    })
};

var createElement = function (text, className) {
    var el = document.createElement('div');
    el.innerText = text;
    el.className = className;
    return el;
};

var renderDate = function(data) {
    var el = document.createElement('div');

    if (data.extraText) {
        el.appendChild(createElement(data.extraText, 'extra-text'));
    }
    if (data.date) {
        el.appendChild(createElement(data.date, 'date'));
    }
    if (data.text) {
        el.appendChild(createElement(data.text, 'text'));
    }

    el.className = data.featured ? 'date-block featured' : 'date-block';

    timelineBlock.appendChild(el);
};

document.addEventListener("DOMContentLoaded", function() {
    render();
});