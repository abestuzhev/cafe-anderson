

ymaps.ready(function () {
    var eventMap = new ymaps.Map('mapEvents', {
            center: [55.751574, 37.573856],
            zoom: 4,
            behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        }),

        eventClusterIcons = [
            {
                href: 'img/m1.png',
                size: [40, 40],
                // Отступ, чтобы центр картинки совпадал с центром кластера.
                offset: [-20, -20]
            },
            {
                href: 'img/m1.png',
                size: [40, 40],
                offset: [-20, -20]
            }],

        eventIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.geoObjects.length]</div>'),

        eventClusterer = new ymaps.Clusterer({
            clusterIcons: eventClusterIcons,
            clusterIconContentLayout: eventIconContentLayout,
            /*Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.*/
            groupByCoordinates: false,
            /*Опции кластеров указываем в кластеризаторе с префиксом "cluster".*/
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        }),

        /*шаблон попапа*/
        eventBalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="popup-event-map">' +
            '<div class="popup-event-map__header"></div>' +
            '<div class="popup-event-map__body" data-simplebar>' +
                '<div class="popup-event-map__item">' +
                    '<div class="c-card-event">' +
                        '<div class="c-card-event__label">' +
                            '<div class="c-card-event__age"><i class="icon-uneven-circle">4+</i></div>' +
                        '</div>' +
                        '<div class="c-card-event__price">Бесплатно</div>' +
                        '<div class="c-card-event__header">' +
                            '<div class="c-card-event__date">19 октября, четверг, 15:00</div>' +
                            '<div class="c-card-event__title"><a href="#">Мастер-класс "Bunchems"</a></div>' +
                        '</div>' +
                        '<div class="c-card-event__body">' +
                            '<div class="c-card-event__info">' +
                                '<div class="c-card-event__item"><i class="icon-mark"></i>ул. Верхняя Красносельская, д. 7/2</div>' +
                                '<div class="c-card-event__item"><img src="img/icons/icon-metro-1.png" alt="">Молодежная</div>' +
                                '<div class="c-card-event__item"><i class="icon-phoneNumber"></i>+7 (495) 125-49-07</div>' +
                                '<div class="c-card-event__item"><svg class="c-symbol symbol-ticket"><use xlink:href="#symbol-ticket" /></svg> Доступное количество мест: 30</div>' +
                            '</div>' +
                            '<div class="c-card-event__text">Учимся создавать осенние цветы и жучков из коструктора-липучек. Чудесные подарки от компании Gulliver каждому участнику.</div>' +
                            '<div class="l-button">' +
                                '<a class="c-button c-button__small c-card-event__link--more" href="#">Подробнее</a>' +
                                '<a class="c-button c-button__small c-button--dark c-card-event__link--basket" href="#">добавить в корзину</a>' +
                                '<a class="c-button c-button__small c-button--dark c-card-event__link--one-click" href="#">оформить в 1 клик</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                //удалить второй блок
                '<div class="popup-event-map__item">' +
                    '<div class="c-card-event">' +
                    '<div class="c-card-event__label">' +
                    '<div class="c-card-event__age"><i class="icon-uneven-circle">4+</i></div>' +
                    '</div>' +
                    '<div class="c-card-event__price">Бесплатно</div>' +
                    '<div class="c-card-event__header">' +
                    '<div class="c-card-event__date">19 октября, четверг, 15:00</div>' +
                    '<div class="c-card-event__title"><a href="#">Мастер-класс "Bunchems"</a></div>' +
                    '</div>' +
                    '<div class="c-card-event__body">' +
                    '<div class="c-card-event__info">' +
                    '<div class="c-card-event__item"><i class="icon-mark"></i>ул. Верхняя Красносельская, д. 7/2</div>' +
                    '<div class="c-card-event__item"><img src="img/icons/icon-metro-1.png" alt="">Молодежная</div>' +
                    '<div class="c-card-event__item"><i class="icon-phoneNumber"></i>+7 (495) 125-49-07</div>' +
                    '<div class="c-card-event__item"><svg class="c-symbol symbol-ticket"><use xlink:href="#symbol-ticket" /></svg> Доступное количество мест: 30</div>' +
                    '</div>' +
                    '<div class="c-card-event__text">Учимся создавать осенние цветы и жучков из коструктора-липучек. Чудесные подарки от компании Gulliver каждому участнику.</div>' +
                    '<div class="l-button">' +
                    '<a class="c-button c-button__small c-card-event__link--more" href="#">Подробнее</a>' +
                    '<a class="c-button c-button__small c-button--dark c-card-event__link--basket" href="#">добавить в корзину</a>' +
                    '<a class="c-button c-button__small c-button--dark c-card-event__link--one-click" href="#">оформить в 1 клик</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                '</div>' +
                //окончания второго блока
            '</div>' +
            '<div class="popup-event-map__title">' +
            '<a href="#">Андерсон для Пап</a>' +
            '<span class="popup-close js-popup-close"></span>' +
            '</div>' +
        '</div>', {

                build: function () {
                    this.constructor.superclass.build.call(this);
                    $('.js-popup-close').bind('click', $.proxy(this.onCloseClick, this));
                },
                clear: function () {
                    $('.js-popup-close').unbind('click', $.proxy(this.onCloseClick, this));
                    this.constructor.superclass.build.call(this);
                },
                onCloseClick: function () {
                    this.getData().geoObject.balloon.close();
                }
            }),

        getPointOptions = function () {
            return {
                iconImageHref: 'img/icons/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-22, -56],
                iconLayout: 'default#image',
                balloonLayout: eventBalloonLayout,
                balloonOffset: [-107, -280],
                balloonShadow: false,
                balloonAutoPan: false
            };
        },

        eventBlacemarks = [
            new ymaps.Placemark([55.74352990795752,37.56841313754272], {
                name: 'АндерСон для Пап',
                address: 'Московский, ул. Хабарова, дом 2, ТРЦ Новомосковский, вход со стороны пруда',
                phoneNumber: '+7 (495) 125-49-07, +7 (495) 125-49-07',
                timeWork: 'пн-вс с 09:00 до 23:00',
                entertainment: 'Зоопарк, Ледовая Арена, Цирк, Театр кукол, Гулливер, Игровая площадка',
                pic: '',
                subway: '<img src="img/icons/icon-metro-1.png" alt="">Молодежная'
            }, getPointOptions()),

            new ymaps.Placemark([55.8,37.9], {
                name: 'АндерСон для Пап',
                address: 'Московский, ул. Хабарова, дом 2, ТРЦ Новомосковский, вход со стороны пруда',
                phoneNumber: '+7 (495) 125-49-07, +7 (495) 125-49-07',
                timeWork: 'пн-вс с 09:00 до 23:00',
                entertainment: 'Зоопарк, Ледовая Арена, Цирк, Театр кукол, Гулливер, Игровая площадка',
                pic: '',
                subway: '<img src="img/icons/icon-metro-1.png" alt="">Молодежная'
            }, getPointOptions()),

            new ymaps.Placemark([59,31], {
                name: 'АндерСон для Пап2',
                address: 'Московский, ул. Хабарова, дом 2, ТРЦ Новомосковский, вход со стороны пруда',
                phoneNumber: '+7 (495) 125-49-07, +7 (495) 125-49-07',
                timeWork: 'пн-вс с 09:00 до 23:00',
                entertainment: 'Зоопарк, Ледовая Арена, Цирк, Театр кукол, Гулливер, Игровая площадка',
                pic: '',
                subway: '<img src="img/icons/icon-metro-1.png" alt="">Молодежная'
            }, getPointOptions()),

            new ymaps.Placemark([57,34], {
                name: 'на Класносельской',
                address: 'Московский, ул. Хабарова, дом 2',
                phoneNumber: '+7 (495) 125-49-07, +7 (495) 125-49-07',
                timeWork: 'пн-вс с 09:00 до 23:00',
                entertainment: 'Зоопарк, Ледовая Арена, Цирк, Театр кукол, Гулливер, Игровая площадка',
                pic: '',
                subway: '<img src="img/icons/icon-metro-1.png" alt="">Молодежная'
            }, getPointOptions()),

            new ymaps.Placemark([60,40], {
                name: 'Тестовое кафе ',
                address: 'Московский, ул. Хабарова, дом 2б Московский, ул. Хабарова, дом 2',
                phoneNumber: '+7 (495) 125-49-07, +7 (495) 125-49-07',
                timeWork: 'пн-вс с 09:00 до 23:00',
                entertainment: 'Зоопарк, Ледовая Арена, Цирк, Театр кукол, Гулливер, Игровая площадка',
                pic: '',
                subway: '<img src="img/icons/icon-metro-1.png" alt="">Молодежная'
            }, getPointOptions())
        ];

    eventMap.geoObjects.events.add([
        'balloonopen'
    ], function (e) {
        var geoObject = e.get('target');
        eventMap.panTo(geoObject.geometry.getCoordinates(), {
            delay: 0
        });
    });

    eventClusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: false
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
        eventMap.behaviors.disable('drag');
    }


    // В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
    eventClusterer.add(eventBlacemarks);
    eventMap.geoObjects.add(eventClusterer);

    // Спозиционируем карту так, чтобы на ней были видны все объекты.
    // myMap.setBounds(clusterer.getBounds(), {
    //     checkZoomRange: true
    // });



});
