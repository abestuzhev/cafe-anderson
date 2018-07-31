/*карта в экскурсиях*/
function panelCafeAddress(){
    ymaps.ready(init);

    function init(){
        var panelCafeMap = new ymaps.Map('panel-map-address', {
                center: [55.780026, 37.715920],
                zoom: 15,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            }, {
                searchControlProvider: 'yandex#search'
            }),

            panelCafePlacemark = new ymaps.Placemark([55.780026, 37.715920], {
                hintContent: 'Андерсон в Крылатском'
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
            panelCafeMap.behaviors.disable('drag');
        }

        panelCafeMap.geoObjects
            .add(panelCafePlacemark);
    }
}

function panelCafeRoute(){
    ymaps.ready(init);

    function init(){
        var panelRouteMap = new ymaps.Map('panel-map-route', {
                center: [55.780026, 37.715920],
                zoom: 15,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            }, {
                searchControlProvider: 'yandex#search'
            }),

            panelRoutePlacemark = new ymaps.Placemark([55.780026, 37.715920], {
                hintContent: 'Андерсон в Крылатском'
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
            panelRoutePlacemark.behaviors.disable('drag');
        }

        panelRouteMap.geoObjects
            .add(panelRoutePlacemark);
    }
}


panelCafeAddress();
panelCafeRoute();