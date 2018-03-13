/*карта в экскурсиях*/
ymaps.ready(function () {
    /**/
    var excursionMap = new ymaps.Map('excursion-contact__map', {
            center: [55.780026, 37.715920],
            zoom: 15,
            behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
        }, {
            searchControlProvider: 'yandex#search'
        }),

        excursionPlacemark = new ymaps.Placemark([55.780026, 37.715920], {
            hintContent: 'Фабрика счастья'
        }, {
            iconLayout: 'default#image',
            iconImageHref: './img/icon-map-point.png',
            iconImageSize: [44, 53],
            iconImageOffset: [-5, -38]
        });

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    if (isMobile.any()) {
        excursionMap.behaviors.disable('drag');
    }

    excursionMap.geoObjects
        .add(excursionPlacemark);
});