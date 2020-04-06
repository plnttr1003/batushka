var timelineBlock = document.querySelector('.timeline-main');
var timelineMap = document.querySelector('.timeline-map-background');
var citeBlock = document.querySelector('.timeline-cite-span');
var timelineCite = document.querySelector('.timeline-cite');
var booksContent = document.querySelector('.books-content');
var bookRightArrow = document.querySelector('.books-arrow-right');
var bookLeftArrow = document.querySelector('.books-arrow-left');
var mainSvg = null;

var dateBlocks = [];
var periodDates = [];
var extraTexts = [];
var bookItems = [];
var shownBooks = {
    start: 0,
    end: 0,
    bookCount: 0
};
var windowHeight = 0;

var render = function() {
    renderSVG({file: 'map.svg', container: timelineMap, fn: renderTimeline});
    renderCite();
    renderBooks();
    calcBooksContainer();
    setInterval(renderCite, 15000);
};

var renderTimeline = function (params) {
    mainSvg = params.svg;
    mainSvg.setAttribute('viewBox', data.baseViewBox);
    data.periods.forEach(function(period) {
        renderTitle(period);

        period.dates.forEach(function(data) {
            renderDate(data);
        })
    });
};

var renderTitle = function (period) {
    var name = period.name;
    var id = period.id;
    var viewbox = period.viewbox;
    var el = document.createElement('div');

    el.className = 'period-date';
    if (id) el.dataset.id = id;
    if (viewbox) el.dataset.viewbox = viewbox;
    el.appendChild(createElement(name, 'period-title'));
    timelineBlock.appendChild(el);
};

var renderCite = function () {
    citeBlock.innerText = data.citates[getRandomInt(0, data.citates.length)]
};

var renderDate = function(data) {
    var el = document.createElement('div');
    var date;
    var text;
    var picture = createElement('', 'date-picture');
    if (data.icon) {
        getSvgIcon(data.icon);
    }

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
    dateBlocks = document.querySelectorAll('.date-block');
    periodDates = document.querySelectorAll('.period-date');
    extraTexts = document.querySelectorAll('.extra-text');
};

var getSvgIcon = function(icon) {
    var el = createElement();
    renderSVG({file: icon.svg, container: el, noChangeStyle: true, fn: createSvgIcon, params: icon});
};

var createSvgIcon = function(params) {
    var svg = params.svg;
    var icon = params.params;
    var style = icon.style;
    var group = svg.querySelector('defs g');

    group.setAttribute('id', icon.id);
    group.setAttribute('style', style);
    group.classList.add('timeline-icon');
    mainSvg.appendChild(group);
    return icon.id;
};

var renderBooks = function() {
    data.books.forEach(function(book) {
        var bookImg = createImg(book.picture, 'book-picture');
        var bookItem = createElement(book.name || '', 'book-item', 'book-name', {type: 'a', attrs: [['href', book.link], ['target', '_blank']]});

        bookItem.appendChild(bookImg);
        booksContent.appendChild(bookItem);
        bookItems.push(bookItem);
    });
};

var calcBooksContainer = function() {
    var documentSize = document.body.offsetWidth;
    var bookCount = Math.floor(documentSize / 280);

    shownBooks.bookCount = bookCount;
    shownBooks.start = 0;
    shownBooks.end = bookCount;
    bookLeftArrow.style.opacity = 0.5;
    showAndHideBooks();
};

var showAndHideBooks = function() {
    bookItems.forEach(function(bookItem, i) {
        if (i >= shownBooks.start && i < shownBooks.end) {
            bookItem.classList.remove('book-hidden');
            bookItem.classList.add('book-visible');
        } else {
            bookItem.classList.add('book-hidden');
            bookItem.classList.remove('book-visible');
        }
    })
};

var scrollBooks = function() {
    bookRightArrow.addEventListener('click', function () {
        if (shownBooks.start < bookItems.length - shownBooks.bookCount) {
            shownBooks.start += 1;
            shownBooks.end += 1;
            showAndHideBooks();
            bookLeftArrow.removeAttribute('style');
            if (shownBooks.start === bookItems.length - shownBooks.bookCount) {
                bookRightArrow.style.opacity = 0.5;
            }
        }

    });
    bookLeftArrow.addEventListener('click', function () {
        if (shownBooks.end > shownBooks.bookCount) {
            shownBooks.start -= 1;
            shownBooks.end -= 1;
            showAndHideBooks();
            bookRightArrow.removeAttribute('style');
            if (shownBooks.end === shownBooks.bookCount) {
                bookLeftArrow.style.opacity = 0.5;
            }
        }
    });
};

document.addEventListener("DOMContentLoaded", function() {
    windowHeight = document.body.clientHeight;
    render();
    scrollBooks();
    lightbox.option({
        'resizeDuration': 0,
        'wrapAround': true,
        'fitImagesInViewport': true,
        'imageFadeDuration': 100,
        'showImageNumberLabel': false
    });
});

window.addEventListener('resize', function () {
    calcBooksContainer();
});

window.addEventListener('scroll', function() {
    if (timelineBlock.getBoundingClientRect().bottom < 0) {
        timelineCite.style.display = 'none';
    }  else {
        timelineCite.style.display = 'flex';
    }

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
        var bottom = periodCont.getBoundingClientRect().bottom;
        var nextTop;
        var viewbox = periodCont.dataset.viewbox.split(' ');
        var prevViewBox = (i > 0 ? periodDates[i - 1].dataset.viewbox : data.baseViewBox).split(' ');

        var ratios = [
            (prevViewBox[0] - viewbox[0]) / windowHeight,
            (prevViewBox[1] - viewbox[1]) / windowHeight,
            (prevViewBox[2] - viewbox[2]) / windowHeight,
            (prevViewBox[3] - viewbox[3]) / windowHeight,
        ];

        if (periodDates[i + 1]) {
            nextTop = periodDates[i + 1].getBoundingClientRect().top;
        }
        if (top < 100 && top > (- nextTop)) {
            periodCont.classList.add('fixed');
            var periodContId = periodCont.dataset.id;


            if (periodContId) {
                // document.getElementById(periodContId).classList.add('active-icon');
            }
        } else {
            periodCont.classList.remove('fixed');
        }

        if (bottom < windowHeight && top > 0) {
            var viewBoxString = '';
            ratios.forEach(function(ratio, i) {
                var value = (parseInt(viewbox[i]) + (ratio * top));

                viewBoxString += (value) + ' ';
            });

            console.log('viewBoxString', viewBoxString);

            mainSvg.setAttribute('viewBox', viewBoxString);
        }
    });

    dateBlocks.forEach(function(dataBlock) {
        var top = dataBlock.getBoundingClientRect().top;

        if (top < 150) {
            dataBlock.classList.add('date-block-hidden');
        } else {
            dataBlock.classList.remove('date-block-hidden');
        }
    })
});
