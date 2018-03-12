/*карта в экскурсиях*/
ymaps.ready(function () {
    /**/
    var excursionMap = new ymaps.Map('excursion-contact__map', {
            center: [55.780026, 37.715920],
            zoom: 15
        }, {
            searchControlProvider: 'yandex#search'
        }),

        excursionPlacemark = new ymaps.Placemark([55.780026, 37.715920], {
            hintContent: 'Фабрика счастья'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '../img/icon-map-point.png',
            iconImageSize: [44, 53],
            iconImageOffset: [-5, -38]
        });

    excursionMap.geoObjects
        .add(excursionPlacemark);
});