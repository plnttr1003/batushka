var timelineBlock = document.querySelector('.timeline-main');
var timelineMap = document.querySelector('.timeline-map-background');
var timelineMain = document.querySelector('.timeline-main');
var hallPlanSvg = document.querySelector('.hallplan-svg');
var citeBlock = document.querySelectorAll('.timeline-cite-span');
var booksContent = document.querySelector('.books-content');
var smallBooksContent = document.querySelector('.small-books-content');
var bookRightArrow = document.querySelector('.books-arrow-right');
var bookLeftArrow = document.querySelector('.books-arrow-left');
var mainSvg = null;
var hall = [];

var dateBlocks = [];
var periodDates = [];
var extraTexts = [];
var bookItems = [];
var shownBooks = {
    start: 0,
    end: 0,
    bookCount: 0
};
var svgIcons = [];
var windowHeight = 0;
var minOffsetHeight = 0;
var periodDateScroll = [];
var citeInterval;

var render = function() {
    renderSVG({file: 'map_2-1.svg', container: timelineMap, fn: renderTimeline});
    renderSVG({file: 'hallplan.svg', container: hallPlanSvg, fn: addHallPlanListener});
    renderCite();
    citeListener();
    renderBooks();
    calcBooksContainer();
    citeInterval = setInterval(renderCite, 25000);
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

    dateBlocks = document.querySelectorAll('.date-block');
    periodDates = document.querySelectorAll('.period-date');
    extraTexts = document.querySelectorAll('.extra-text');
    calcScrollValues();
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
    citeBlock[0].innerText = data.citates[getRandomInt(0, data.citates.length)];
    citeBlock[1].innerText = data.citates[getRandomInt(0, data.citates.length)];
};

var citeListener = function () {
    citeBlock[0].addEventListener('click', rerenderCite);
    citeBlock[1].addEventListener('click', rerenderCite);
};

var rerenderCite = function () {
    clearInterval(citeInterval);
    renderCite();
    citeInterval = setInterval(renderCite, 25000);
};

var renderDate = function(data) {
    var el = document.createElement('div');
    var date;
    var text;
    var picture = createElement('', 'date-picture');
    if (data.icon) {
        getSvgIcon(data.icon);
        el.dataset.iconId = data.icon.id;
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
        if (data.popupPicture) {
            picture.addEventListener('click', function() {
                console.log(data.popupPicture);
                openPopup({position: 'center', image: 'timeline/' + data.popupPicture});
            });
        }
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
};

var getSvgIcon = function(icon) {
    var el = createElement();
    renderSVG({file: icon.svg, container: el, noChangeStyle: true, fn: createSvgIcon, params: icon});
};

var createSvgIcon = function(params) {
    var svg = params.svg;
    var icon = params.params;
    var poster =  params.params.poster;
    var style = icon.style;
    var groups = svg.querySelectorAll('defs g');
    var iconGroup = document.createElementNS("http://www.w3.org/2000/svg","g");

    iconGroup.setAttribute('id', icon.id);
    iconGroup.setAttribute('style', style);
    iconGroup.classList.add('timeline-icon');

    iconGroup.addEventListener('click', function() {
        openPopup({position: 'right', image: poster});
    });

    svgIcons.push(iconGroup);

    groups.forEach(function(group, i) {
        if (i === 0) {
            group.classList.add('icon-background');
        }
        if (i === 1) {
            group.classList.add('icon-content');
        }
        iconGroup.appendChild(group);
    });

    mainSvg.appendChild(iconGroup);

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

    data.extraBooks.forEach(function(book) {
        var bookImg = createImg(book.picture, 'book-picture');
        var bookItem = createElement(book.name || '', 'book-item', 'book-name', {type: 'a', attrs: [['href', book.link], ['target', '_blank']]});

        bookItem.appendChild(bookImg);
        smallBooksContent.appendChild(bookItem);
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

var calcScrollValues = function() {
    var offsetHeights = [];
    periodDates.forEach(function (periodCont, i) {
        if (i > 1) {
            var offsetHeight = periodCont.getBoundingClientRect().top - periodDates[i - 1].getBoundingClientRect().top;
            offsetHeights.push(offsetHeight);
        }
    });
    minOffsetHeight = Math.min.apply(Math, offsetHeights);

    periodDates.forEach(function (periodCont, i) {
        var viewbox = periodCont.dataset.viewbox.split(' ');
        var prevViewBox = (i > 0 ? periodDates[i - 1].dataset.viewbox : data.baseViewBox).split(' ');
        var ratios = [];

        prevViewBox.forEach(function(prevValue, i) {
            ratios.push((prevValue - viewbox[i]) / minOffsetHeight);
        });
        periodDateScroll.push({
            viewbox: viewbox,
            ratios: ratios,
        })
    });
};

var addHallPlanListener = function() {
    hall = [
        {
            svgColor: document.querySelector('.hall-color.hall-1'),
            svgHover: document.querySelector('.hall-hover.hall-1'),
            name: document.querySelector('.hallplan-text-hall-name.hall-1'),
            annotations: document.querySelector('.hall-annotations.hall-1'),
        },
        {
            svgColor: document.querySelector('.hall-color.hall-2'),
            svgHover: document.querySelector('.hall-hover.hall-2'),
            name: document.querySelector('.hallplan-text-hall-name.hall-2'),
            annotations: document.querySelector('.hall-annotations.hall-2'),
        },
        {
            svgColor: document.querySelector('.hall-color.hall-3'),
            svgHover: document.querySelector('.hall-hover.hall-3'),
            name: document.querySelector('.hallplan-text-hall-name.hall-3'),
            annotations: document.querySelector('.hall-annotations.hall-3'),
        },
        {
            svgColor: document.querySelector('.hall-color.hall-4'),
            svgHover: document.querySelector('.hall-hover.hall-4'),
            name: document.querySelector('.hallplan-text-hall-name.hall-4'),
        },
        {
            svgColor: document.querySelector('.hall-color.hall-5'),
            svgHover: document.querySelector('.hall-hover.hall-5'),
            name: document.querySelector('.hallplan-text-hall-name.hall-5'),
        },
    ];

    hall.forEach(function(hallEl) {
        hallEl.name.addEventListener('mouseover', function() {
            console.log('>>>');
            hall.forEach(function(extHallEl) {
                extHallEl.svgColor.classList.remove('active-color-hall');
            });
            hallEl.svgColor.classList.add('active-color-hall');
        });
        hallEl.name.addEventListener('mouseout', function() {
            hallEl.svgColor.classList.remove('active-color-hall');
        });

        hallEl.svgHover.addEventListener('mouseover', function() {
            console.log('>ww>>');
            hall.forEach(function(extHallEl) {
                extHallEl.name.classList.remove('active-hall-name');
            });
            hallEl.name.classList.add('active-hall-name');
        });
        hallEl.svgHover.addEventListener('mouseout', function() {
            hallEl.name.classList.remove('active-hall-name');
        });


        hallEl.name.addEventListener('click', function () {
            hall.forEach(function(extHallEl) {
                if (extHallEl.annotations) {
                    extHallEl.annotations.classList.remove('hall-annotations-visible');
                }
            });
            if (hallEl.annotations) {
                hallEl.annotations.classList.add('hall-annotations-visible');
            }
        });

        hallEl.svgHover.addEventListener('click', function () {
            hall.forEach(function(extHallEl) {
                if (extHallEl.annotations) {
                    extHallEl.annotations.classList.remove('hall-annotations-visible');
                }
            });
            if (hallEl.annotations) {
                hallEl.annotations.classList.add('hall-annotations-visible');
            }
        });
    })


    hall.forEach(function(extHallEl) {
        if (extHallEl.annotations) {
            extHallEl.annotations.addEventListener('click', function() {
                extHallEl.annotations.classList.remove('hall-annotations-visible');
            })
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

    var timelineTop = timelineMain.getBoundingClientRect().top;

    if (timelineTop > 100) {
        timelineMap.style.opacity = 0;
    } else {
        timelineMap.style.opacity = 1;
    }


    var activeDate = true;

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
        } else {
            periodCont.classList.remove('fixed');
        }

        if (top < minOffsetHeight && top > 0) {
            var viewBoxString = '';
            periodDateScroll[i].ratios.forEach(function(ratio, k) {
                var value = (parseInt(periodDateScroll[i].viewbox[k]) + ratio * top);

                viewBoxString += (value) + ' ';
            });
            mainSvg.setAttribute('viewBox', viewBoxString);
        }
    });

    dateBlocks.forEach(function(dataBlock) {
        var top = dataBlock.getBoundingClientRect().top;

        if (top < 50) {
            dataBlock.classList.add('date-block-hidden');
        } else {
            dataBlock.classList.remove('date-block-hidden');
        }

        if ((top > windowHeight / 2 - 300) && (top < windowHeight / 2 + 300) && activeDate) {
            dataBlock.classList.add('active-date');
            activeDate = false;
            if (dataBlock.dataset.iconId) {
                svgIcons.forEach(function(svgIcon) {
                    if (svgIcon.getAttribute('id') === dataBlock.dataset.iconId) {
                        svgIcon.classList.add('active-icon', 'shown-icon');
                    }
                })
            }
        } else {
            dataBlock.classList.remove('active-date');
            if (dataBlock.dataset.iconId) {
                svgIcons.forEach(function(svgIcon) {
                    if (svgIcon.getAttribute('id') === dataBlock.dataset.iconId) {
                        svgIcon.classList.remove('active-icon');
                    }
                })
            }
        }
    });
});

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
