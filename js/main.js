var $body,
	windowHeight,
	windowWidth,
	mediaPoint1 = 1024,
	mediaPoint2 = 768,
	mediaPoint3 = 480,
	mediaPoint4 = 320;



$(document).ready(function ($) {
    //------------------------------------------------------------custom

    /*функция показа модального окна*/
    function showPopup(icon, popup) {
        $(icon).on('click', function (e) {
            e.preventDefault();
            $(popup).addClass('popup-show');
            $('.popup-bg').addClass('is-visible');
            $('body').addClass('body-popup');
        });
    }

    showPopup(".header-phone", '.popup__request-call');
    showPopup(".header-email", '.popup__write-to-us');
    showPopup(".header-cabinet", '.popup-authorization');
    showPopup(".header-city", '.popup-city');


    $('.popup-authorization .popup-authorization__reg').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup').removeClass('popup-show');
        $('.popup-reg').addClass('popup-show');
    });

    $('.popup-reg .popup-authorization__auth').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup').removeClass('popup-show');
        $('.popup-authorization').addClass('popup-show');
    });

    $(".popup-close").click(function (e) {
        e.preventDefault();
        $(this).parents('.popup').removeClass('popup-show');
        $('.popup-bg').removeClass('is-visible');
        $('body').removeClass('body-popup');
    });

    // закрытие по клику всне области экрана
    $(".popup-bg").click(function (e) {
        e.preventDefault();
        $('.popup').removeClass('popup-show');
        $(this).removeClass('is-visible');
        $('body').removeClass('body-popup');
    });

    /*клик вне области экрана для корзины*/
    $(document).mouseup(function (e) { // событие клика по веб-документу
        var div = $(".popup-basket"); // тут указываем ID элемента
        if (!div.is(e.target) // если клик был не по нашему блоку
            && div.has(e.target).length === 0) { // и не по его дочерним элементам
            div.removeClass('popup-basket__show'); // скрываем его
        }
    });


    /*попап корзины*/
    $('.header-basket').on('click', function () {
        $('.popup-basket').addClass('popup-basket__show');
    });
    $('.popup-basket__close').on('click', function () {
        $('.popup-basket').removeClass('popup-basket__show');
    });

    function catalogItemCounter(field) {
        var fieldCount = function (el) {
            var
                // Мин. значение
                min = el.data('min') || false,

                // Макс. значение
                max = el.data('max') || false,
                // Кнопка уменьшения кол-ва
                dec = el.prev('.dec'),
                // Кнопка увеличения кол-ва
                inc = el.next('.inc');

            function init(el) {
                if (!el.attr('disabled')) {
                    dec.on('click', decrement);
                    inc.on('click', increment);
                }

                // Уменьшим значение
                function decrement() {
                    var value = parseInt(el[0].value);
                    value--;

                    if (!min || value >= min) {
                        el[0].value = value;
                    }
                };

                // Увеличим значение
                function increment() {
                    var value = parseInt(el[0].value);

                    value++;

                    if (!max || value <= max) {
                        el[0].value = value++;
                    }
                };

            }

            el.each(function () {
                init($(this));
            });
        };

        $(field).each(function () {
            fieldCount($(this));
        });
    }

    catalogItemCounter('.fieldCount');

    $('.popup-basket__scroll').css()

// });

    //------------------------------------------------------------custom###

	$body = $('body');
	windowWidth = $(window).width();
	windowHeight = $(window).height();

	//developer funcitons
	pageWidget(['index']);
	getAllClasses('html','.elements_list');
});

$(window).on('load', function () {
	loadFunc();
});

$(window).on('resize', function () {
	resizeFunc();
});

$(window).on('scroll', function () {
	scrollFunc();
});

function loadFunc() {

}
function resizeFunc() {
	updateSizes();
}

function scrollFunc() {
	updateSizes();
}

function updateSizes() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
}

if ('objectFit' in document.documentElement.style === false) {
	document.addEventListener('DOMContentLoaded', function () {
		Array.prototype.forEach.call(document.querySelectorAll('img[data-object-fit]'), function (image) {
			(image.runtimeStyle || image.style).background = 'url("' + image.src + '") no-repeat 50%/' + (image.currentStyle ? image.currentStyle['object-fit'] : image.getAttribute('data-object-fit'));

			image.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'' + image.width + '\' height=\'' + image.height + '\'%3E%3C/svg%3E';
		});
	});
}

//Functions for development
function getAllClasses(context, output) {
	var finalArray = [],
		mainArray = [],
		allElements = $(context).find($('*'));//get all elements of our page
	//If element has class push this class to mainArray
	for (var i = 0; i < allElements.length; i++) {
		var someElement = allElements[i],
			elementClass = someElement.className;
		if (elementClass.length > 0) {//if element have not empty class
			//If element have multiple classes - separate them
			var elementClassArray = elementClass.split(' '),
				classesAmount = elementClassArray.length;
			if (classesAmount === 1) {
				mainArray.push('.' + elementClassArray[0] + ' {');
			} else {
				var cascad = '.' + elementClassArray[0] + ' {';
				for (var j = 1; j < elementClassArray.length; j++) {
					cascad += ' &.' + elementClassArray[j] + ' { }';
				}
				mainArray.push(cascad);
			}
		}
	}

	//creating finalArray, that don't have repeating elements
	var noRepeatingArray = unique(mainArray);
	noRepeatingArray.forEach(function (item) {
		var has = false;
		var preWords = item.split('&');
		for (var i = 0; i < finalArray.length; ++i) {
			var newWords = finalArray[i].split('&');
			if (newWords[0] == preWords[0]) {
				has = true;
				for (var j = 0; j < preWords.length; ++j) {
					if (newWords.indexOf(preWords[j]) < 0) {
						newWords.push(preWords[j]);
					}
				}
				finalArray[i] = newWords.join('&');
			}
		}
		if (!has) {
			finalArray.push(item);
		}
	});
	for (var i = 0; i < finalArray.length; i++) {
		$('<div>' + finalArray[i] + ' }</div>').appendTo(output);
	}

	//function that delete repeating elements from arrays, for more information visit http://mathhelpplanet.com/static.php?p=javascript-algoritmy-obrabotki-massivov
	function unique(A) {
		var n = A.length, k = 0, B = [];
		for (var i = 0; i < n; i++) {
			var j = 0;
			while (j < k && B[j] !== A[i]) j++;
			if (j == k) B[k++] = A[i];
		}
		return B;
	}
}
/*
function pageWidget(pages) {
	var widgetWrap = $('<div class="widget_wrap"><ul class="widget_list"></ul></div>');
	widgetWrap.prependTo("body");
	for (var i = 0; i < pages.length; i++) {
		$('<li class="widget_item"><a class="widget_link" href="' + pages[i] + '.html' + '">' + pages[i] + '</a></li>').appendTo('.widget_list');
	}
	var widgetStilization = $('<style>body {position:relative} .widget_wrap{position:absolute;top:0;left:0;z-index:9999;padding:10px 20px;background:#222;border-bottom-right-radius:10px;-webkit-transition:all .3s ease;transition:all .3s ease;-webkit-transform:translate(-100%,0);-ms-transform:translate(-100%,0);transform:translate(-100%,0)}.widget_wrap:after{content:" ";position:absolute;top:0;left:100%;width:24px;height:24px;background:#222 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAABGdBTUEAALGPC/xhBQAAAAxQTFRF////////AAAA////BQBkwgAAAAN0Uk5TxMMAjAd+zwAAACNJREFUCNdjqP///y/DfyBg+LVq1Xoo8W8/CkFYAmwA0Kg/AFcANT5fe7l4AAAAAElFTkSuQmCC) no-repeat 50% 50%;cursor:pointer}.widget_wrap:hover{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.widget_item{padding:0 0 10px}.widget_link{color:#fff;text-decoration:none;font-size:15px;}.widget_link:hover{text-decoration:underline} </style>');
	widgetStilization.prependTo(".widget_wrap");
}
*/