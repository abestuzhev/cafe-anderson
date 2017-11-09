
    // Как только будет загружен API и готов DOM, выполняем инициализацию
    ymaps.ready(init);
    var myMap;
    function init() {
        // Создание экземпляра карты и его привязка к контейнеру с
        // заданным id ("map")
        myMap = new ymaps.Map('map', {
            // При инициализации карты, обязательно нужно указать
            // ее центр и коэффициент масштабирования
            center: [55.7745045087803, 37.590385793792734],
            zoom: 5
//            behaviors: ['default', 'scrollZoom']
        }, {
            geoObjectBalloonAutoPan: false,
            geoObjectBalloonPanelMaxMapArea: Infinity
        });


//        myMap.behaviors.disable('multiTouch');
//        myMap.behaviors.disable('drag');

//        var isMobile = {
//            Android: function() {return navigator.userAgent.match(/Android/i);},
//            BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
//            iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
//            Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
//            Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
//            any: function() {
//                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
//            }
//        };
//
//// после вызова карты
//        if(isMobile.any()){
//            myMap.behaviors.disable('drag');
//        }


        var cafe_1 = new ymaps.Placemark([55.74352990795752, 37.56841313754272], {
            name: 'АндерСон для Пап',
            address: 'Московский, ул. Хабарова, дом 2, ТРЦ Новомосковский, вход со стороны пруда',
            phoneNumber: '+7 (495) 125-49-07, +7 (495) 125-49-07',
            timeWork: 'пн-вс с 09:00 до 23:00',
            entertainment: 'Зоопарк, Ледовая Арена, Цирк, Театр кукол, Гулливер, Игровая площадка',
            subway: '<img src="img/icons/icon-metro-1.png" alt="">Молодежная'
        }, {
            // Изображение иконки метки
            iconImageHref: 'img/icons/icon-map-point.png',
            // Размеры изображения иконки
            iconImageSize: [44, 53],
            // смещение картинки
            iconImageOffset: [-22, -56],
            // Размеры содержимого балуна
            balloonContentSize: [660, 265],
            // Задаем макет балуна - пользовательская картинка с контентом
            balloonLayout: "default#imageWithContent",
            // Смещение картинки балуна
            balloonImageOffset: [-117, -300],
            // Размеры картинки балуна
            balloonImageSize: [660, 265],
            // Балун не имеет тени
            balloonShadow: false,
            //Выравнивание по умолчанию
            balloonAutoPan: false
        });

        // Создаем коллекцию, в которую будем добавлять метки
        myCollection = new ymaps.GeoObjectCollection();

        //Добавляем метки в коллекцию геообъектов.
        myCollection
            .add(cafe_1);

        // Создаем шаблон для отображения контента балуна
        /*шаблон попапа*/
        var myBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="c-card-cafe c-card-map">' +
            '<div class="c-card-map__header">' +
            '<span class="popup-close" id="close-balloon" onclick="myMap.balloon.close()"></span>' +
            '<a href="#" class="c-card-map__title">$[properties.name]</a>' +
            '</div>' +
            '<div class="c-card-map__body">' +
            '<div class="c-card-cafe__img">' +
            '<img src="img/cafe-foto.jpg" alt="">' +
            '<a  href="#" class="c-card-cafe__menu">' + '<i class="icon-food-menu"></i>' + 'меню</a>' +
            '</div>' +
            '<div class="c-card-cafe__body">' +
            '<div class="c-card-cafe__item">' + '<b>Адрес: </b>' + '$[properties.address]</div>' +
            '<div class="c-card-cafe__item">' + '<b>Телефон: </b>' + '$[properties.phoneNumber]</div>' +
            '<div class="c-card-cafe__item">' + '<b>Время работы: </b>' + '$[properties.timeWork]</div>' +
            '<div class="c-card-cafe__item c-card-cafe__subway">' +
            '$[properties.subway]' +
            '</div>' +
            '<div class="c-card-cafe__item c-card-cafe__entertainment">$[properties.entertainment]</div>' +
            '<ul class="c-card-cafe-advantages">' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-coffe"></i></li>' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-guests"></i>150</li>' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-teddy"></i></li>' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-nipple"></i></li>' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-balloon"></i></li>' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-umbrella"></i></li>' +
            '<li class="c-card-cafe-advantages__item"><i class="advantages-bottle"></i></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
        // Помещаем созданный шаблон в хранилище шаблонов. Теперь наш шаблон доступен по ключу 'my#cafelayout'.
        ymaps.layout.storage.add('my#cafelayout', myBalloonLayout);

        // Задаем наш шаблон для балунов геобъектов коллекции.
        myCollection.options.set({
            balloonContentBodyLayout: 'my#cafelayout',
            // Максимальная ширина балуна в пикселах
            balloonMaxWidth: 660
        });


        myMap.geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            myMap.panTo(geoObject.geometry.getCoordinates(), {
                delay: 0
            });
        });

        // Добавляем коллекцию геообъектов на карту.
        myMap.geoObjects.add(myCollection);
//        map.panTo(myCollection.geometry.getCoordinates());

        // Добавляем элементы управления.
        myMap.controls.add('zoomControl');
        myMap.controls.add('fullscreenControl');

//        myMap.behaviors.disable('multiTouch');
//        myMap.behaviors.disable('drag');
    }
