






$(function(){

});






$(function(){

    ymaps.ready(init);

    function init() {
        /*--------------------------------------------------------------------*/
        var mapDelivery = new ymaps.Map('order-delivery__map', {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            });
        var mapPickup = new ymaps.Map('order-pickup__map', {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            });

        var mapDeliveryCake = new ymaps.Map('order-cake-delivery__map', {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            });

        var mapPickupCake = new ymaps.Map('order-cake-pickup__map', {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            });

        var cakePageOrder = new ymaps.Map('cake-order__map', {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            });

        var deliveryCollection = new ymaps.GeoObjectCollection(),
            pickupCollection = new ymaps.GeoObjectCollection(),
            deliveryCakeCollection = new ymaps.GeoObjectCollection(),
            pickupCakeCollection = new ymaps.GeoObjectCollection(),
            cakePageOrderCollection = new ymaps.GeoObjectCollection(),

            placemarksOrder = [
                [55.74352990795752, 37.56841313754272],
                [55.8, 37.9],
                [59, 31],
                [57, 34],
                [60, 40]
            ];

        function addPlacemark(collection) {
            for (var i = 0, l = placemarksOrder.length; i < l; i++) {
                collection.add(new ymaps.Placemark(placemarksOrder[i], {
                    iconContent: "Кафе АндерСон на Красносельской"
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: '../img/icon-map-point.png',
                    // iconImageHref: 'https://image.ibb.co/fpL27R/icon_map_point.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38]
                }));
            }
        }

        addPlacemark(deliveryCollection);
        addPlacemark(pickupCollection);
        addPlacemark(deliveryCakeCollection);
        addPlacemark(pickupCakeCollection);
        addPlacemark(cakePageOrderCollection);


        mapDelivery.geoObjects.add(deliveryCollection);
        mapPickup.geoObjects.add(pickupCollection);
        mapDeliveryCake.geoObjects.add(deliveryCakeCollection);
        mapPickupCake.geoObjects.add(pickupCakeCollection);
        cakePageOrder.geoObjects.add(cakePageOrderCollection);


    }
})


$(function() {

    function loftMap() {
        /*карта в экскурсиях*/
        ymaps.ready(function () {
            /**/
            var loftMap = new ymaps.Map('loft-map', {
                    center: [55.780026, 37.715920],
                    zoom: 15,
                    behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                }, {
                    searchControlProvider: 'yandex#search'
                }),

                loftPlacemark = new ymaps.Placemark([55.780026, 37.715920], {
                    hintContent: 'Лофт'
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
                loftMap.behaviors.disable('drag');
            }

            loftMap.geoObjects
                .add(loftPlacemark);
        });
    }

    loftMap();

});