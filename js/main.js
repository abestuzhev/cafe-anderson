var $body,
	windowHeight,
	windowWidth,
	mediaPoint1 = 1024,
	mediaPoint2 = 768,
	mediaPoint3 = 480,
	mediaPoint4 = 320;


//
// var el = document.querySelector('.cafe-description__text');
// SimpleScrollbar.initEl(el);


//загрузка скрипта
// var scriptMap = document.createElement('script');
// scriptMap.src = "https://api-maps.yandex.ru/2.0/?load=package.standard,package.geoObjects&lang=ru-RU";
// document.documentElement.appendChild(scriptMap);

// var scriptTool = document.createElement('script');
// scriptTool.src = "https://abestuzhev.github.io/cafe-anderson/bower_components/tooltipster/dist/js/tooltipster.bundle.js";
// document.documentElement.appendChild(scriptTool);

/*main.js*/


var windowWidth = (window.innerWidth ); // вся ширина окна
var documentWidth = (document.documentElement.clientWidth ); // ширина минус прокрутка
// console.log('Ширина window: ' + windowWidth);
// console.log('Ширина wrapper: ' + documentWidth);
var documentHeight = (document.documentElement.clientHeight );
// console.log('высота ' + documentHeight);



$(window).on('load', function(){


    if($('.holidays-grid').find('.holidays-grid__container').length > 0 ) {
        customGridRefreshPosition('.holidays-grid', '.holidays-grid__container' );
        $(window).on('resize', function () {
            customGridRefreshPosition('.holidays-grid', '.holidays-grid__container');
        });
    };

    if($('div').hasClass('preloader')) {
        $('.preloader').find('.loader').fadeOut().end().delay(100).fadeOut(100);
    };


    // $('.holidays').addClass('show');

    /*скролл при выборе доставки*/
    var orderDeliveryMap = $('.order-delivery__map').height(),
        orderDeliveryAddressList = $('.order-delivery-address__list'),
        orderDeliveryAddressListHeight = orderDeliveryAddressList.height();
    // console.log('orderDeliveryMap: ' + orderDeliveryMap);
    // console.log('orderDeliveryAddressList: ' + orderDeliveryAddressListHeight);


    function changeHeightAddressList (){
        orderDeliveryAddressList.each(function(index, elem){
            var elemHeight =  $(elem).height();
            // console.log('elemHeight: ' + elemHeight);
            if(elemHeight > 320){
                // new SimpleBar(orderDeliveryAddressList[0]);
                // new SimpleBar(orderDeliveryAddressList[1]);
                // new SimpleBar(orderDeliveryAddressList[2]);
                // new SimpleBar(orderDeliveryAddressList[3]);
                $(elem).addClass('scroll-wrap');
            }
        });
    }
    changeHeightAddressList();

    //хак для быстрого обрезания всего списка в модальном окне заказа торта

    function addClassCakesAddressList(){
        $('.popup-cake-order .order-delivery-address__list').addClass('scroll-wrap');
    }
    addClassCakesAddressList();

    // $(document).on('click', '.cake-card__hover', function(){
    //     $('.popup-cake-order .order-delivery-address__list').addClass('scroll-wrap');
    //     console.log('scroll-wrap add');
    // });




    if($('div').hasClass('js-mixed-list')){
        var containerEl = document.querySelector('.js-mixed-list');
        var mixer = mixitup(containerEl);
    }

    $(document).on('click', '.order-tabs__item', function(){
        changeHeightAddressList();
    });



    var permitPath = [
    '/factory-happiness.html',
    '/cafe-anderson/factory-happiness.html'
    ];

    function getScrollElem (elem){
        if($(window).width() <= 800) {
            new SimpleBar($(elem)[0]);
        }
    }
    if(permitPath.indexOf(location.pathname) > -1){
        getScrollElem('.factory-layout');
        $(window).on('resize', function () {
            getScrollElem('.factory-layout');
        });
    } else {
        return false;
    }

    var $datepicker = $('.datepicker-here');
    $datepicker.datepicker({
        minDate: new Date(),
        autoClose: true
    });
    $datepicker.on('focus', function () {
        $(this).parents('.datepicker-layout').addClass('active-datepicker');
    });


    $('#datepickerCustom').datepicker({
        minDate: new Date(),
        autoClose: true
    });
    $('#datepickerCustom').on('focus', function () {
        $(this).parents('.datepicker-layout').addClass('active-datepicker');
    });


    var disabledPartyDays = [0, 7];
    $('#party-datepicker').datepicker({
        minDate: new Date(),
        inline: true,
        // onRenderCell: function (date, cellType) {
        //     if (cellType == 'day') {
        //         var day = date.getDay(),
        //             isDisabled = disabledPartyDays.indexOf(day) != -1;
        //
        //         return {
        //             disabled: isDisabled
        //         }
        //     }
        // }
    });

    //календарь в мероприятиях
    var eventDates = [1, 10, 12, 22];
    $('#event-datepicker').datepicker({
        inline: true,
        onRenderCell: function (date, cellType) {
            var currentDate = date.getDate();
            if (cellType == 'day' && eventDates.indexOf(currentDate) != -1) {
                return {
                    html: currentDate + '<span class="dp-note"></span>'
                }
            }
        }
    });
    $('.js-event-order-datepicker').datepicker({
        minDate: new Date()
    });









});

$(document).ready(function ($) {
    //------------------------------------------------------------custom




    // $('.child-holiday-say').slick({
    //     centerMode: true,
    //     centerPadding: '60px',
    //     slidesToShow: 3,
    //     responsive: [
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 arrows: false,
    //                 centerMode: true,
    //                 centerPadding: '40px',
    //                 slidesToShow: 3
    //             }
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 arrows: false,
    //                 centerMode: true,
    //                 centerPadding: '40px',
    //                 slidesToShow: 1
    //             }
    //         }
    //     ]
    // });

    $('.child-holiday-say').owlCarousel({
        center: true,
        items:3,
        loop:true,
        margin:10,
        responsive:{
            1200:{
                items:3
            },
            800:{
                items:2
            },
            540:{
                items:1
            },
            310:{
                items:1
            }
        }
    });


    /*кнопка заказать новогодний праздник*/
    $('.new-year-order__btn').on('click', function(e){
        e.preventDefault();
        $(this).hide();
        $('.new-year-order-request').slideDown(300);
    })

    /*pie-filling__show*/
    // показывать начинки на странице с тортами
    $(document).on('click', '.pie-filling__show', function(e){
        e.preventDefault();
        $('.pie-filling-wrapper').slideToggle(300);

        var textBtn = $(this).find('.pie-filling__show-word').html();
        if(textBtn == 'Посмотреть'){
            $(this).find('.pie-filling__show-word').html('Свернуть');
            $(this).find('svg').css({
                transform: 'rotate(180deg)'
            });
        }else{
            $(this).find('.pie-filling__show-word').html('Посмотреть');
            $(this).find('svg').css({
                transform: 'rotate(0)'
            });
        }
    });

    /*filter-subscription*/
    /*пдписка в фильтре*/
    // $(document).on('click', '.filter-subscription__btn', function(e){
    //     e.preventDefault();
    //     $(this).parents('.filter-subscription').find('.filter-subscription__body').addClass('is-show');
    //     $(this).parents('.filter-subscription__btn-layout').hide();
    // })

    $(document).on('click', '.filter-subscription__btn', function(e){
        e.preventDefault();
        // $(this).parents('.filter-subscription').find('.filter-subscription__body').addClass('is-show');
        $(this).parents('.filter-subscription').addClass('animate');
        $(this).parents('.filter-subscription').find('input').focus();
    });



    $('.c-card-cafe-info__close').on('click', function(e){
        e.preventDefault();
        $(this).parents('.c-card-cafe-info__form').slideUp(200);
    });



    $('.c-card-hall-time__btn').on('click', function(e){
        e.preventDefault();
        $(this).parents('.c-card-cafe').find('.c-card-cafe-info__form').slideDown(200);
    });



    /*конструктор праздников. Показ информации о карточки*/
    $(document).on('click', '.c-card-cafe-booking__btn', function(e){
        var self = $(this);
        e.preventDefault();

        self.parents('.c-card-cafe').find('.c-card-cafe-info').slideToggle(300);

        console.log($(this).html());
        if($(this).html() == 'свернуть'){

            self.html('посмотреть');
        }else{
            self.html('свернуть');
        }
    });


    /*выбор месяцав календаре праздничных пространств*/
    $(document).on('click', '.calendar-header__month a:nth-child(1)', function(e){
        e.preventDefault();
        $('.calendar-header-popup:not(.calendar-header-popup_year)').addClass('is-visible');
    });

    $(document).on('click', '.calendar-month__item', function(e){
        e.preventDefault();
        $('.calendar-header-popup:not(.calendar-header-popup_year)').removeClass('is-visible');
    });

    /*выбор года в календаре праздничных пространств*/
    $(document).on('click', '.calendar-header__month a:nth-child(2)', function(e){
        e.preventDefault();
        $('.calendar-header-popup.calendar-header-popup_year').addClass('is-visible');
    });

    $(document).on('click', '.calendar-month__item', function(e){
        e.preventDefault();
        $('.calendar-header-popup.calendar-header-popup_year').removeClass('is-visible');
    });



    /*слайдер на странице общих пращдников*/
    $('.holidays-slide').owlCarousel({
        items:1,
        loop:false,
        center:true,
        nav:false,
        // margin:10,
        URLhashListener:true,
        autoplayHoverPause:true,
        startPosition: 'URLHash'
    });




    $(document).on('click', '.c-card-catalog__footer.v2 .c-card-catalog__basket', function(){
        $(this).hide();
        $(this).siblings('.c-card-catalog__count').show();
    });

    $(document).on('click', '.c-card-catalog-2 .c-card-catalog__basket', function(){
        $(this).hide();
        $(this).siblings('.c-card-catalog__count').show();
    });



    if($('div').hasClass('js-readmore')){
        $('.cake-order-composition').readmore({
            speed: 75,
            moreLink: '<a href="#">Подробный состав</a>',
            lessLink: '<a href="#">Свернуть состав</a>'
        });
    }




    // if($('div').hasClass('js-slick')){
    //     $('.pie-slider-for').slick({
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         arrows: false,
    //         fade: true,
    //         asNavFor: '.pie-slider-nav'
    //     });
    //
    //     $('.pie-slider-nav').slick({
    //         slidesToShow: 3,
    //         slidesToScroll: 1,
    //         speed: 500,
    //         asNavFor: '.pie-slider-for',
    //         // dots: true,
    //         // centerMode: true,
    //         focusOnSelect: true,
    //         slide: 'div'
    //     });
    // }

    $(document).on('click', '.pie-slider-nav__item', function(){
        var self = $(this);
        self.siblings().removeClass('active');
        self.addClass('active');
        var path = self.children('img').attr('src');

        $('.pie-slider-for').find('img').attr('src', path).animate({
            opacity: '1'
        },200);
    });




    /*START карусель*/
    //Обработка клика на стрелку вправо
    $(document).on('click', ".popup-pie .pie-slider-right",function(){
        var carusel = $(this).parents('.pie-slider');
        right_carusel(carusel);
        var path = $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(1).children('img').attr('src');
        // console.log(path);

        $('.pie-slider-for').find('img').animate({'opacity': 0}, 100);
        setTimeout(function(){
            $('.pie-slider-for').find('img').attr('src', path);
            $('.pie-slider-for').find('img').animate({'opacity': 1}, 100);;
        },100);

        return false;
    });

    //Обработка клика на стрелку влево
    $(document).on('click',".popup-pie .pie-slider-left",function(){
        var carusel = $(this).parents('.pie-slider');
        left_carusel(carusel);
        var path = $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).children('img').attr('src');

        $('.pie-slider-for').find('img').animate({'opacity': 0}, 100);
        setTimeout(function(){
            $('.pie-slider-for').find('img').attr('src', path);
            $('.pie-slider-for').find('img').animate({'opacity': 1}, 100);
        },100);

        return false;
    });

    function left_carusel(carusel){
        var block_width = $(carusel).find('.pie-slider-nav__item').outerWidth();
        $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(-1).clone().prependTo($(carusel).find(".pie-slider-items"));
        $(carusel).find(".pie-slider-items").css({"left":"-"+block_width+"px"});
        // $(carusel).find(".pie-slider-items .pie-slider-nav__item").removeClass('active');
        // $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).addClass('active');
        $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(-1).remove();
        $(carusel).find(".pie-slider-items").animate({left: "0px"}, 500);

    }

    function right_carusel(carusel){
        var block_width = $(carusel).find('.pie-slider-nav__item').outerWidth();
        $(carusel).find(".pie-slider-items").animate({left: "-"+ block_width +"px"}, 500, function(){
            $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).clone().appendTo($(carusel).find(".pie-slider-items"));
            // $(carusel).find(".pie-slider-items .pie-slider-nav__item").removeClass('active');
            // $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(1).addClass('active');
            $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).remove();
            $(carusel).find(".pie-slider-items").css({"left":"0px"});
        });
    }



    /*START карусель*/

    if($('.pie-filling-wrapper').hasClass('is-hidden')){
        console.log('no hidden');
        $('.pie-filling-left').hide();
        $('.pie-filling-right').hide();
    }else{
        console.log('class hidden');

        //Обработка клика на стрелку вправо
        $(".pie-filling-right").on('click',function(e){
            e.preventDefault();
            var carusel = $(this).parents('.pie-filling');
            filling_right_carusel(carusel);
            // console.log('право');

            // console.log('filling_left_carusel : ' + filling_left_carusel(carusel));
            // console.log('filling_right_carusel : ' + filling_right_carusel(carusel));

        });

        //Обработка клика на стрелку влево
        $('.pie-filling-left').on('click', function(e){
            e.preventDefault();
            var carusel = $(this).parents('.pie-filling');
            filling_left_carusel(carusel);
            // console.log('лево');

        });
        // var block_width = $('.pie-filling').find('.pie-filling__item').outerWidth();
        var filling_block_width = $('.pie-filling-wrapper').width();
        $('.pie-filling__item').css({
            'width': filling_block_width - 9
        });

        $(window).resize(function(){
            var filling_block_width = $('.pie-filling-wrapper').width();
            var w = $(window).width();
            if(w < 627){
                $('.pie-filling__item').css({
                    'width': filling_block_width - 9
                });
            }else{

            }

        });
    }


    function filling_right_carusel(carusel){
        // var block_width = $(carusel).find('.pie-filling__item').outerWidth();
        $(carusel).find(".pie-filling__items").animate({left: "-"+ filling_block_width +"px"}, 200);
        setTimeout(function () {
            $(carusel).find(".pie-filling__items .pie-filling__item").eq(0).clone().appendTo($(carusel).find(".pie-filling__items"));
            $(carusel).find(".pie-filling__items .pie-filling__item").eq(0).remove();
            $(carusel).find(".pie-filling__items").css({"left":"0px"});
        }, 300);
    }


    function filling_left_carusel(carusel){

        $(carusel).find(".pie-filling__items .pie-filling__item").eq(-1).clone().prependTo($(carusel).find(".pie-filling__items"));
        $(carusel).find(".pie-filling__items").css({"left":"-"+filling_block_width+"px"});
        // $(carusel).find(".pie-filling__items").animate({"left":"-"+filling_block_width+"px"}, 1000);
        $(carusel).find(".pie-filling__items").animate({left: "0px"}, 300);
        $(carusel).find(".pie-filling__items .pie-filling__item").eq(-1).remove();

    }






//аналогичная карусель для начинок



//     $(function() {
// //Раскомментируйте строку ниже, чтобы включить автоматическую прокрутку карусели
// //	auto_right('.carousel:first');
//     })
//
// // Автоматическая прокрутка
//     function auto_right(carusel){
//         setInterval(function(){
//             if (!$(carusel).is('.hover'))
//                 right_carusel(carusel);
//         }, 1000)
//     }

// Навели курсор на карусель
//     $(document).on('mouseenter', '.pie-slider', function(){$(this).addClass('hover')})
//Убрали курсор с карусели
//     $(document).on('mouseleave', '.pie-slider', function(){$(this).removeClass('hover')})

    /*END карусель*/




    /*загрузка файлов на странице с кондитерскими изделиями*/
    $("#pie-form-download__file").on('change', function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
    function imageIsLoaded(e) {
        $('#pie-form-download__img').attr('src', e.target.result).show();
    };


    /*resize img c-card-catalog-2__img*/
    $('.c-card-catalog-2__img').each(function(i, val){

        var pieImgContainerWidth = $(val).width();
        var pieImgWidth = $(val).children('img').width();


        if(pieImgWidth < pieImgContainerWidth){
            $(val).children('img').css({
                'width': '100%',
                'height': 'auto'

            });
        }
    });




    /*кнопка раскрытия информации в карточке c-card-slide*/
    $(document).on('click', '.c-card-slide__dropdown', function(e){
        e.preventDefault();
        var self = $(this);
        self.toggleClass('active');
        self.parents('.c-card-slide__info').toggleClass('show');
    })


    function addReadonlyInput(elem){
        $(elem).attr('readonly', 'readonly');
    }

    addReadonlyInput('.datepicker-here');
    addReadonlyInput('.datepicker-custom');
    addReadonlyInput('#minMaxExample');
    addReadonlyInput('.datepicker-delivery-v2');
    addReadonlyInput('#event-datepicker');
    addReadonlyInput('.js-event-order-datepicker');
    addReadonlyInput('#party-datepicker');
    addReadonlyInput('.datepicker-layout input');
    addReadonlyInput('.datepicker-layout-v2 input');

    /*хлебные крошки - выпадающий список*/
    $(document).on('click', '.c-breadcrumb-word__active span', function(e){
        e.preventDefault();
        $(this).parent('.dropdown').toggleClass('open');
        $(this).siblings('.c-breadcrumb-dropdown__layout').toggleClass('is-visible');
    })


    function initCustomSelect(elem){
        $(elem).SumoSelect();

    }

    function initCustomSelectSearch(elem){
        $(elem).SumoSelect({
            search: true,
            searchText: 'Искать...'
        });
    }

    function initCustomDatepicker(elem){
       $(elem).datepicker({
            minDate: new Date()
            // autoClose: true

        });

       // var value = $(elem).val();
       // $(elem).val(value);
       // console.log(value);
       // elem.val(value);
    }


    function reloadValueDatepicker (elem){
        $.each($(elem), function(){
            // var value = $(this).val();
            // $(this).data('value', value);
            var dataValue = $(this).data('value');
            $(this).val(dataValue);
            // console.log(value);
            console.log($(this).val());
        });
    }



    // reloadValueDatepicker('#js-event-data__list .datepicker-custom-clock');



    var countCheckbox = 0;

    function addClonePanel(btn, list){
        var rand;
        function randomInteger(min, max) {
            rand = min - 0.5 + Math.random() * (max - min + 1);
            rand = Math.round(rand);
            return rand;
        }

        initCustomSelectSearch('#js-event-data__list .js-select-search-copy');
        initCustomSelect('#js-event-data__list .panel-event-date__item select');



        $(document).on('click', btn , function(e) {
            e.preventDefault();
            $(this)
                .parents('.c-form__item')
                .siblings('.panel-work-time__copy')
                .clone().appendTo(list);

            // var select = $(this)

            initCustomSelectSearch('#js-event-data__list .js-select-search-copy');
            initCustomSelectSearch('#js-dish-variation__list .js-select-search-copy');

            initCustomDatepicker('#js-event-data__list .panel-work-time__copy:last-child .datepicker-custom-clock');

            // reloadValueDatepicker('#js-event-data__list .datepicker-custom-clock');

            initCustomSelect('' + list + ' select');
            initCustomSelect('#js-dish-variation__list .panel-dish-variation__item:last-child select');
            initCustomSelect('#js-event-data__list .panel-event-date__item:last-child select');
            // console.log('initCustomSelectSearch');
            $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
            $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});
            $('.js-input--mode').mask('00:00 — 00:00', {
                clearIfNotMatch: true,
                placeholder: "__:__ — __:__"
            });

            randomInteger(1, 99999);


            countCheckbox +=1;
            // console.log(count);



            var checkbox = $(this)
                .parents('.c-form__item')
                .siblings('.panel-work-time__copy').find('input[type="checkbox"]');
            var checkLabel = $(this)
                .parents('.c-form__item')
                .siblings('.panel-work-time__copy').find('input[type="checkbox"]').siblings('label');

            // checkbox.attr('name', );

            checkbox.attr('name', 'panel-event-free-' + rand);
            checkbox.attr('id', 'panel-event-free-' + rand);
            checkLabel.attr('for', 'panel-event-free-' + rand);
            // console.log(checkLabel);


        });
    }



    addClonePanel('#js-work-time-coffee__add', '#js-panel-work-time__coffee');
    addClonePanel('#js-work-time-cafe__add', '#js-panel-work-time__cafe');
    addClonePanel('#js-work-time-mp__add', '#js-panel-work-time__mp');
    addClonePanel('#js-work-time-animator__add', '#js-panel-work-time__animator');
    addClonePanel('#js-dish-variation__add', '#js-dish-variation__list');
    addClonePanel('#js-event-data__add', '#js-event-data__list');

    $(document).on('click', '.c-form__del', function(e) {
        e.preventDefault();
        var $elem_item = $(this).parents('.panel-work-time__copy');
        $elem_item.remove();
    });

    $(document).on('click', '.testReload', function(e) {
        e.preventDefault();
    //    panel-dish-variation__list
    //     $('.panel-dish-variation__list select').each(function(index){
    //         $(this)[index].sumo.reload();
    //         console.log(index);
    //     });
        $('.panel-dish-variation__list select')[1].sumo.reload();
        console.log('OK!!!');


    });


    //административная панель
    $(document).on('click', '.panel-cafe__title', function(e){
        e.preventDefault();
        $(this).toggleClass('panel-cafe-show');
        $(this).siblings('.panel-cafe__body').slideToggle(100);
    });

    $(document).on('click', '.panel-cafe__title', function(e){
        e.preventDefault();
        $(this).toggleClass('panel-cafe-show');
        $(this).siblings('.panel-hall__body').slideToggle(100);
    });



    //управление рассылкой
    $('.dispatch-list__title input').on('change', function(){
        var self = $(this);
        if(self.is( ":checked" )){
            self.parents('.dispatch-list__title')
                .siblings('.dispatch-list')
                .find('input[type="checkbox"]')
                .prop( "checked", true );
        }else {
            self.parents('.dispatch-list__title')
                .siblings('.dispatch-list')
                .find('input[type="checkbox"]')
                .prop( "checked", false );
        }
    });

    var lenEvent = $('.dispatch-list__item input[name*="dispatch-event"]').length;
    // console.log('колдичество ' + lenEvent);



    function changeDispatchCheckbox(elem){
        var count;

        $('' + elem + ' input').each(function(index){
            count = index+1;
        });
        // console.log('количество each ' + elem + ': ' + count);

        $('' + elem + ' input').on('change', function(){
            var self = $(this);
            if(!self.is( ":checked" )){
                self.parents('.dispatch-list')
                    .siblings('.dispatch-list__title')
                    .find('input[type="checkbox"]')
                    .prop( "checked", false );
            }

            if($('' + elem + ' input[type=checkbox]:checked').length == count){
                self.parents('.dispatch-list')
                    .siblings('.dispatch-list__title')
                    .find('input[type="checkbox"]')
                    .prop( "checked", true );
            }
        });
    }

    changeDispatchCheckbox('.js-dispatch-news');
    changeDispatchCheckbox('.js-dispatch-event');

    if($('div').hasClass('franchise-conditions-table__slick')){
        function initMobileSliderFranchise(){
            $('.franchise-conditions-table__slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                accessibility: false
            });
            $('.franchise-conditions-table__slick').slick('setPosition');
        }

        initMobileSliderFranchise();
    }




    //франшиза
    $('.franchise-title').on('click', function(){
        var self = $(this);
        console.log();
        self.parents('.franchise-title-layout').siblings('.franchise-content').slideToggle(100);
        self.siblings('.franchise-print').toggle();
        if($(window).width() < 756) {
            $('.franchise-conditions-table__slick').slick('setPosition');
            $('.slick-slide-2').slick('setPosition');
            $('.slick-slide-3').slick('setPosition');
        }

        $(window).on('resize orientationchange', function() {

            if($(window).width() < 756) {
                //initMobileSliderFranchise();
            }
        });
    });


    var divToPrint = document.getElementById("franchisePrint");
    function printData(){
        // var divToPrint = $(elem).parents('.franchise-content');

        var newWin= window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    }

    function PrintElem(elem)
    {
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>' + document.title  + '</h1>');
        mywindow.document.write(document.getElementById(elem).innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
    }

    $('.franchise-print').on('click',function(){
        // printData();
        var self = $(this);
        // $('*').hide();
        $('.franchise-box').removeClass('print');
        self.parents('.franchise-box').addClass('print');
        window.print();
        // PrintElem(divToPrint);
    });



    if($('input').hasClass('datepicker-custom') || $('div').hasClass('datepicker-custom')){
        $('.datepicker-custom').datepicker({
            minDate: new Date(),
            autoClose: true
        });
    }

    if($('input').hasClass('datepicker-custom-clock') || $('div').hasClass('datepicker-custom-clock')){
        $('.datepicker-custom-clock').datepicker({
            minDate: new Date(),
            // onSelect: function(formattedDate){
            //     $(this).val(formattedDate);
            //     var datePick = formattedDate;
            //     $(this).data('value', datePick);
            //     console.log('Выводит data-value: ' + $(this).data('value'));
            // }
        });
    }


    /*функция форматирования даты*/
    function formatDate(date) {
        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        var yy = date.getFullYear();
        if (yy < 10) yy = '0' + yy;

        return dd + '.' + mm + '.' + yy;
    }

    if($('input').hasClass('datepicker-delivery-v2') || $('div').hasClass('datepicker-delivery-v2')){


        var datepickerDelivery = new Date(),
            datepickerDeliveryV2= $('.datepicker-delivery-v2');
        // datepickerDeliveryV2.val(formatDate(datepickerDelivery));
        datepickerDeliveryV2.datepicker({
            minDate: new Date(),
            autoClose: true
        });




    }


    

    $('document').on('click', '.order__btn.disabled', function(e){
        e.preventDefault();
    });

    $('.excursion-pay__item label').on('click', function(){
        $(this).parents('.excursion-pay__item').siblings().find('label').removeClass('active');
        $(this).addClass('active');
    });



    //модальное окно в экскурсиях
    $(document).on('change', '#excursion-pay-score', function(){
        if($(this).prop( "checked" )){
            $('.excursion-pay-score').slideDown(300);
        }
    });

    $(document).on('change', '#excursion-pay-card', function(){
        if($(this).prop( "checked" )){
            $('.excursion-pay-score').slideUp(300);
        }
    });


    /*изменение оплаты*/
    $('.order-pay__item').on('click', function(){
        var payRadio = $(this).children('input');
        if(payRadio.prop("checked")){
            $(this).siblings('.order-pay__item').find('label').removeClass('active');
            $(this).children('label').addClass('active');
        }
    });



    $(document).on('click', '.filter-hold__dropdown', function(e){
        e.preventDefault();
        $(this).parents('.filter-hold__item').siblings().removeClass('active');
        $(this).parents('.filter-hold__item').addClass('active');
        $(this).siblings('.filter-hold__submenu').slideDown(500);
    });



    // documentHeight
    function changeHeightBasketPopup (){
        var basketScroll = $('.popup-basket__scroll'),
            heightBasket = basketScroll.height();

        if (heightBasket >= documentHeight - 100){
            basketScroll.addClass('fixed-height-basket');
            // console.log('if ' + heightBasket);
            /*кастомный скролл*/
            basketScroll.jScrollPane();
        }else {
            basketScroll.removeClass('fixed-height-basket');
            // console.log('else ' + heightBasket);
        }
    }

    changeHeightBasketPopup();

    $(window).resize(function(){
        changeHeightBasketPopup();
    });
    /*картинки одной ширины*/

    $('.c-card-catalog__img').each(function(index, elem){
        var img = $(elem).children('img'),
            imgWidth = img.width(),
            $this = $(elem);

        // console.log('element ' + index + ': ' + 'width: ' + imgWidth);
        if(imgWidth < 390 ) {
            $this.addClass('big-product-img');
            // console.log('есть картинка меньше 390');
        }else {
            $this.removeClass('big-product-img');
            // console.log('работает но картинки нет');
        }
    });


    //показать все мероприятия по дням на странице Мероприятия
    $(document).on('click', '.c-card-event-timelist__more', function(e){
        e.preventDefault();
        var $this = $(this);

        var textBtn = $this.html();
        if(textBtn == "показать все"){
            $this.html("скрыть");
            $this.siblings('.c-card-event-timelist').addClass('show-item-all');
        }else{
            $this.html("показать все");
            $this.siblings('.c-card-event-timelist').removeClass('show-item-all');
        }
    });


    function changePartyTitlePopup (){
        $(document).on('click', '.js-party-order', function(){
            var letter = $(this).data('name'),
                title = $('.popup-party-order .popup-title').find('span');

            title.text('');
            title.append(letter);
            $('#title-party-order').val(letter);
        });
    }
    // changePartyTitlePopup();



    //появление мобильного чека в корзине
    $(document).on('click', '.basket__check-mobile', function(e){
        e.preventDefault();
        $('.basket__aside').toggleClass('active');
    });

    //изменение в оформлении заказа на другого пользователя
    $(document).on('change', '#order-user_other, .order-user_other',  function(){
        if($(this).prop( "checked" )){
            $('.order-user__list').css('display','none');
            $('.order-user__other-form').css('display','flex');
        }
    });
    $(document).on('change', '#order-user_auth, #order-user_auth-1', function(){
        if($(this).prop( "checked" )){
            $('.order-user__list').css('display','flex');
            $('.order-user__other-form').css('display','none');
        }
    });

    //редактировать профиль
    $(document).on('click', '.lk-profile__link-edit', function(e){
        e.preventDefault();
        $(this).parents('.lk-profile__item')
            .children('div:first-child')
            .hide();
        $(this).parents('.lk-profile__item')
            .children('.lk-profile-edit:eq(0)')
            .show();

        initProfilePlugin();

    });

    function initProfilePlugin(){
        //маска
        $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
        $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});

        /*селект*/
        $('.lk-profile-edit__child-list .js-select--child').SumoSelect();
        changeSelectFace('.lk-profile-edit__child-list .js-select--child', 'M','icon-boy-smiling','icon-girl-smiling');
    };

    // $(document).on('click', '.lk-profile__edit .c-button__medium', function(){
    //     $(this).parents('.lk-profile-edit').hide;
    //     $(this).parents('.lk-profile-item').children('div:first-child').show();
    // });

    /*слайдер для страницы Выпускные*/
    $('.graduation-party-banner__slider').owlCarousel({
        loop:true,
        items: 1,
        autoheight: true,
        nav: false
    });


    //плавный якорь
    function scrollToAnchor (elem) {
        $(document).on("click", elem, function (event) {
            // event.preventDefault();
            var id  = $(this).attr('href'),
                menuHeight = 0,
                top = $(id).offset().top,
                topIndent = top - menuHeight;
            // console.log('top: ' + top);
            // console.log('topIndent: ' + topIndent);
            $('html').animate({scrollTop: topIndent}, 1000);
        });
    };

    $('.graduation-party-banner__btn, .holiday-offers-banner__btn').click(function(e){
        e.preventDefault();
        console.log('hello');
        var target = $($(this).attr('href'));
        if(target.length){

            var heightHeader = $('.header').height();
            var scrollTo = target.offset().top - (+heightHeader + 100);
            $('body, html').animate({scrollTop: scrollTo+'px'}, 800);
        }
    });

    $('.child-holiday-banner__btn').click(function(e){
        e.preventDefault();
        var target = $($(this).attr('href'));
        if(target.length){

            var heightHeader = $('.header').height();
            var scrollTo = target.offset().top - (+heightHeader + 100);
            $('body, html').animate({scrollTop: scrollTo+'px'}, 800);
        }
    });

    // $('#excursion-program-btn').click(function(e){
    //     e.preventDefault();
    //     var target = $($(this).attr('href'));
    //     if(target.length){
    //
    //         var heightHeader = $('.header').height();
    //         var scrollTo = target.offset().top - (+heightHeader + 100);
    //         $('body, html').animate({scrollTop: scrollTo+'px'}, 800);
    //     }
    // });

    // scrollToAnchor('.graduation-party-banner__btn');
    // scrollToAnchor('.graduation-party-banner__btn');


    //поиск по кафе на странице с тортами и в оформлении заказа
    $(document).on('keyup change', '.c-search-page__input', function(){
        checkAll('.order-delivery-address__list li', '.order-radio', '.c-search-page__input');
        checkAll('#js-box-search-additive .c-box-search__item', '.c-checkbox', '#js-box-search-additive .c-search-page__input');
        checkAll('#js-box-search-ingredient .c-box-search__item', '.c-checkbox', '#js-box-search-ingredient .c-search-page__input');
        checkAll('#js-box-search-event .c-box-search__item', ' .order-radio', '#js-box-search-event .c-search-page__input');
    });

    function checkAll(elem, whereSearch, input) {
        $(elem).each(function(i, item) {
            var value = $(this).find(whereSearch).text().toLowerCase().indexOf($(input).val().toLowerCase());
            if ( value >= 0 ) {
                $(this).show();
                // $(this).addClass('js-order-delivery-address__show');
            } else {
                $(this).hide();
                // $(this).removeClass('js-order-delivery-address__show');
            }
        });
    }

    checkAll('.order-delivery-address__list li', '.order-radio', '.c-search-page__input');
    checkAll('#js-box-search-additive .c-box-search__item', '.c-checkbox', '#js-box-search-additive .c-search-page__input');
    checkAll('#js-box-search-ingredient .c-box-search__item', ' .c-checkbox', '#js-box-search-ingredient .c-search-page__input');
    checkAll('#js-box-search-event .c-box-search__item', ' .order-radio', '#js-box-search-event .c-search-page__input');

    $(document).on('click', '.c-box-search__clear', function(e){
        e.preventDefault();
        $('.c-search-page__input').val('');
        $('.c-box-search__item').show();

    });

    //отписаться от подписки в личном кабинете
    $(document).on('click', '#lk-profile-subscription_unsubscribe', function(e){
        e.preventDefault();
        $('.lk-profile .lk-profile-subscription__box').hide();
        $('.lk-profile .lk-profile-subscription-del').show();

    });
    $(document).on('click', '#lk-profile-subscription-del__cancel', function(e){
        e.preventDefault();
        $('.lk-profile .lk-profile-subscription-del').hide();
        $('.lk-profile .lk-profile-subscription__box').show();
    });

    //изменнеие пароля в профиле личного кабинета
    $(document).on('click', '#lk-profile__change-pass', function(e){
        e.preventDefault();
        $(this)
        .parents('.lk-profile-user')
        .css('display', 'none')
        .siblings('.lk-profile-edit__pass')
        .css('display', 'block');
    });

    // изменение подписки в профиле пользователя
    $('#lk-profile_change-subscription').on('click', function(e){
        e.preventDefault();
        $(this)
        .parents('.lk-profile-subscription__box')
        .css('display', 'none')
        .siblings('.lk-profile-edit')
        .css('display', 'block');
    });
    // отмена изменения подписки в профиле пользователя
    $('#lk-profile_cancel-change').on('click', function(e){
        e.preventDefault();
        $(this)
        .parents('.lk-profile-edit')
        .css('display', 'none')
        .siblings('.lk-profile-subscription__box')
        .css('display', 'block');
    });

    //добавляем элементы в профиле личного кабинета
    //добавление второго email

    $(document).on('click', '#js-lk-profile__add-email', function(e) {
        e.preventDefault();
        $(this)
            .parents('.c-form__item')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__email-list");
    });

    $(document).on('click', '#js-lk-profile__add-tel', function(e) {
        e.preventDefault();
        $(this)
            .parents('.c-form__item')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__tel-list");
        $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
    });

    /*добавление полей в контактах ЛК*/
    $(document).on('click', '#js-lk-profile__add-info-all', function(e) {
        e.preventDefault();
        console.log('correct');
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__contact-list");
        // $('.js-input--date').mask('0(000)000-00-00', {clearIfNotMatch: true});

        // initProfilePlugin();
    });

    /*добавление ребенка в профиле пользователя*/
    $(document).on('click', '#js-lk-profile__add-child', function(e) {
        e.preventDefault();
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__child-list");
        $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});

        initProfilePlugin();
    });


    $(document).on('click', '#js-lk-profile-edit__address', function(e) {
        e.preventDefault();
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__address-list");
    });


    $(document).on('click', '.c-form__del', function(e) {
        e.preventDefault();
        var $elem_item = $(this).parents('.c-form__item');
        var $element =  $(this).parents('.lk-profile-edit__copy');
        $element.remove();
        $elem_item.remove();
    });

    //скрыть/показать заказ в истории заказов
    $('.lk-history-item__header').on('click', function(e){
        e.preventDefault();
        $(this).parents('.lk-history-item').toggleClass('lk-history-item__body-show');
        $(this).siblings('.lk-history-item__body').slideToggle(300);
    });


    //очистить форму поиска
    $(document).on('click', '.order-delivery-search__clear', function(e){
        e.preventDefault();
        $(this).parents('.order-delivery-search__item').siblings().find('input').val('');
        $('.order-delivery-address__all').removeClass('show-item-all');

        // showDeliveryAddressCake('.order-delivery-address__item');
    });

    //показать все адреса кафе в заказе
    function showDeliveryAddressCake (elem){
        $(elem).each(function(i, elem){
            i < 6 ? $(elem).show() : $(elem).hide();
        });
    }
    // showDeliveryAddressCake('.order-delivery-address__item');




    $(document).on('click', '.order-delivery-address__all', function(e){
        var $this = $('.order-delivery-address__all');
        e.preventDefault();

        var textBtn = $this.html();
        if(textBtn == "показать все"){
            $this.html("скрыть");
            $this.siblings('.order-delivery-address__list').addClass('show-item-all');
        }else{
            $this.html("показать все");
            $this.siblings('.order-delivery-address__list').removeClass('show-item-all');
        }

    });

    //страница Оформление заказа. При фокусе на инпут с адресом, делаем активный radio button
    $('.order-delivery-custom__item input, .order-delivery-custom__item textarea').focus(function(){
        var $this = $(this);
        // var $thisRadioInput = $(this).parents('label').siblings('input[type="radio"]');
        $this.parents('label').siblings('input[type="radio"]').prop( "checked",true);

    });



    //свернуть/развернуть блок в корзине
    $('.basket-item__header').on('click', function(){
        var $this =  $(this);
        $this.parents('.basket-item').toggleClass('basket-body__show');
        setTimeout(function(){

        }, 150);

        $(this).siblings('.basket-item__body').slideToggle(100);
    });

    $('.basket-mix__item').on('click', function(){

        $('.basket-item__header').parents('.basket-item').addClass('basket-body__show');
        $('.basket-item__body').slideDown(100);
    });



    /*показываем попап на странице Создатели Андерсон*/
    $('.photo-point__icon').on('click', function(){
        var str = $(this).siblings('.photo-point__description').find('span').text().trim(),
            arr = str.split(' '),
            name = arr[0] + ' ' + arr[1],
            desc = '';
        arr.splice(0, 2);
        desc = arr.join(' ');
        $('.creators .popup-title').find('span').text(name);
        $('.creators .popup-body').find('p').text(desc);
        var popup = $('.creators .popup');
        popup.removeClass('is-visible');
        popup.addClass('is-visible');
    });

    $('.creators .popup-close').on('click', function(){
        $('.creators .popup').removeClass('is-visible');
    });

    /*фабрика счастья, клик по поинту*/
    $('.factory-point__img').on('click', function(){
        $('.popup').removeClass('is-visible');
        $(this).siblings('.popup').addClass('is-visible');
    });

    $('.factory-point .popup-close').on('click', function(e){
        e.preventDefault();
        $('.popup').removeClass('is-visible');
    });

    /*показываем маленький блок с выбранными товарами в карточке товара (мобильная версия)*/
    $(document).on('click', '.popup-product__check-mobile', function(e){
        e.preventDefault();
        $('.popup-product .popup-mini').addClass('active');
    });
    /*закрываем маленький попап с товарами*/
    $(document).on('click', '.popup-product__check-close', function(e){
        e.preventDefault();
        $('.popup-product .popup-mini').removeClass('active');
    });

    $('.popup-mini').on('click', function(e){
        e.preventDefault();

    });

    /*показываем категории меню в каталоге*/
    var filterBage = $('.filter-bage');

    filterBage.on('click', function(e){
        e.preventDefault();
        $(this).hide();
        $('.catalog-body').toggleClass('show-category');
        $(this).toggleClass('js-hide-word');
        $(this).find('.filter-bage__title span').html('Показать');
        $('.js-hide-word').find('.filter-bage__title span').html('Скрыть');
    });

    $('.filter-hold__close').on('click', function(e){
        e.preventDefault();
        filterBage.show();
        $('.catalog-body').removeClass('show-category');
        filterBage.toggleClass('js-hide-word');
        $('.filter-bage__title span').html('Показать');
    });




    $(window).on('resize', function () {
    	if(windowWidth <= 730){
    	    $('.filter-hold__close').on('click', function(e){
                e.preventDefault();
    	        $(this).parents('.filter-hold').slideUp(600);
            });
        }
    });

    if(windowWidth <= 730){
        $('.filter-hold__close').on('click', function(e){
            e.preventDefault();
            $(this).parents('.filter-hold').slideUp(600);
        });
    }





    /*слайдер карусель*/
    $('.carousel-slider').owlCarousel({
        loop:true,
        // nav:true,
        margin:20,
        // items: 4,
        // center: true,
        responsiveClass: true,
        responsive:{
            0:{
                items:1
            },
            540:{
                nav: true,
                items:2
            },
            780:{
                nav: true,
                items:3
            },
            1200:{
                nav: true,
                items:4
            },
            1600:{
                nav: true,
                items:5
            }
        }
    });

    $('.c-card-product__slider').owlCarousel({
        loop:true,
        // nav:true,
        // margin:20,
        // items: 4,
        // center: true,
        mouseDrag:false,
        pullDrag:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                nav: true,
                items:2
            },
            1200:{
                nav: true,
                items:3
            },
            1600:{
                nav: true,
                items:3
            }
        }
    });

    $(".c-card-product__slider .owl-item").on("touchstart mousedown", function(e) {
        // Prevent carousel swipe
        e.stopPropagation();
    })

    /*слайдер карусель*/
    $('.publications-slider').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        items: 7,
        // center: true,
        stagePadding: 10,
        responsiveClass: true,
        responsive:{
            0:{
                items:1
            },
            480:{
                items:2
            },
            780:{
                nav: true,
                items:3
            },
            980:{
                nav: true,
                items:4
            },
            1200:{
                nav: true,
                items:4
            },
            1600:{
                nav: true,
                items:7
            },
            1920:{
                nav: true,
                items:7
            }
        }
    });


    $('#filter-cafe-all, #filter-cafe__mobile-all').on('change', function(){
        var $this = $(this),
            $elem = $('.filter-item');
        if($this.is(':checked')) {
            $elem.addClass('disable');
        }else{
            $elem.removeClass('disable');
        }
    });

    $('.top-message__close').on('click',function(e){
        e.preventDefault();
        $('.top-message').hide();
    });

    /*вписываем img в блок при любом размере изображения*/
    function fix_size() {
        var images = $('.c-pic_link img');
        images.each(setsize);

        function setsize() {
            var img = $(this),
                img_dom = img.get(0),
                container = img.parents('.c-pic_link');
            if (img_dom.complete) {
                resize();
            } else img.one('load', resize);

            function resize() {
                if ((container.width() / container.height()) < (img_dom.width / img_dom.height)) {
                    img.width('auto');
                    img.height('100%');
                    return;
                }
                img.height('auto');
                img.width('100%');
            }
        }

    }
    // $(window).on('resize', fix_size);
    // fix_size();
    //
    // if (typeof _current != 'undefined') {
    //     var mapImages = _current;
    // } else {
    //     var mapImages = $('.c-card-cafe__img img');
    // }

    /*если в городе одно кафе, делаем его inline*/
    $('.cafe-list__city').each(function(){
        var $this = $(this);
        var countElem = $this.find('.c-col-6').length;
        if(countElem == 1){
            $($this).addClass('cafe-list__one');

        }else{
            $($this).removeClass('cafe-list__one');
        }
    });



    //подключение тултипа
    $( '.tooltip' ).tooltipster({
        animation: 'grow',
        delay: 100,
        trigger : 'custom' ,
        maxWidth: 500,
        contentAsHTML: true,
        interactive: true,
        triggerOpen : {
            mouseenter : true ,
            touchstart : true
        },
        triggerClose : {
            mouseleave : true,
            click : true ,
            scroll : true ,
            tap : true
        }
    });


    //подключение тултипа
    $( '.tooltip-catalog' ).tooltipster({
        animation: 'grow',
        delay: 100,
        trigger : 'click' ,
        maxWidth: 500,
        functionBefore: function(instance, helper){
            if (helper.event.type == 'click') {
                instance.content('You opened me with a regular mouse <a href="https://www.google.ru/?hl=ru">click :)</a>.');
            }
            else {
                instance.content('You opened me by a tap on the screen :)');
            }
        },
        contentAsHTML: true,
        interactive: true,
        triggerOpen : {
            mouseenter : true ,
            touchstart : true
        },
        triggerClose : {
            mouseleave : true,
            click : true ,
            scroll : true ,
            tap : true
        }
    });



    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        center: true,
        autoHeight:true,
        nav: true
    });


    $('.cafe-fotorama').on('fotorama:ready', function (e, fotorama) {
        // console.log(e.type);
        // console.log( fotorama.activeIndex);
        var path = fotorama.activeFrame.img;
        $('.bg-blur').attr('src', path);
    }).fotorama({
        width: '100%',
        // maxwidth: '100%',
        ratio: 17/11,
        loop: true,
        thumbwidth: 88,
        allowfullscreen: true,
        nav: 'thumbs',
        fit:'cover'
    });


    if($('div').hasClass('pie-fotorama')){
        $('.pie-fotorama').fotorama({
            thumbwidth: 125,
            thumbHeight: 88,
            nav: 'thumbs',
            navposition: 'top',
            transition: 'crossfade'
        });
    };




    /*Фоторама, слайдер мероприятий, слайдер отзывов*/
    // var $slider = $('.cafe-fotorama').fotorama({
    //     width: '100%',
    //     // maxwidth: '100%',
    //     ratio: 17/11,
    //     loop: true,
    //     thumbwidth: 88,
    //     allowfullscreen: true,
    //     nav: 'thumbs',
    //     fit:'cover'
    // });

    // $slider
    //     .on('fotorama:show', function (e, fotorama) {
    //         // pick the active thumb by id
    //         var path = fotorama.activeFrame.img;
    //         $('.bg-blur').attr('src', path);
    //         console.log('hello');
    //     });




    // $slider.on('fotorama:load', function (e, fotorama, extra) {
    //     console.log(extra.src + ' is loaded');
    //     console.log('hello');
    // });


    $('.cafe-holiday-slider').fotorama({
        width: '100%',
        maxwidth: '100%',
        // ratio: 16/9,
        loop: true,
        allowfullscreen: true,
        fit:'cover'
    });

    // $('.cafe-reviews-slider').fotorama({
    //     width: '100%',
    //     height: 'auto',
    //     maxwidth: '100%',
    //     loop: true,
    //     ratio: 16/5
    // });

    /*маски для телефона*/
    $('#request-call__tel, #reg__phone').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('#request-call__tel, #reg__phone').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});
    $('.js-input--loyalty').mask('000-000', {clearIfNotMatch: true });

    $('.js-input--mode').mask('00:00 — 00:00', {
        clearIfNotMatch: true,
        placeholder: "__:__ — __:__"
    });
    $('input[name="form_text_30"]').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('input[name="form_text_52"]').mask('0(000)000-00-00', {clearIfNotMatch: true});

    /*показ номера телефона в карточке кафе*/
    $('.cafe-info__item-col .c-button').on('click', function(e){
        e.preventDefault();
        $(this).hide();
        $(this).parents('.l-button').siblings('.cafe-info__phone-number').show();
    });

    /*функция показа модального окна*/
    function showPopup(icon, popup) {
        $(document).on('click', icon, function (e) {
            var $html = $('html');
            e.preventDefault();
            $(popup).addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');


            $html.addClass('lock-html');
            $('body').addClass('fixed-input');
            if(windowWidth > documentWidth){
                $html.css({
                    'margin-right':'17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y':'scroll'
                });
                // console.log('Есть полоса прокрутки');
            }else {
                // console.log('Нет полосы прокрутки');
            }
        });
    }

    $(document).on('click', '.popup-close', function (e) {
        e.preventDefault();
        var $html = $('html');
        $(this).parents('.mfp-wrap').removeClass('is-visible');
        $('.mfp-bg').removeClass('is-visible');
        $html.css({
            'margin-right':'0'
        }).removeClass('lock-html');
        $('body').removeClass('fixed-input');
        $('.header.sticky').css({
            // 'right':'0'
        });
        // console.log('popup-close!!!!');
    });

    $(document).on('click', '.js-popup-close', function (e) {
        e.preventDefault();
        var $html = $('html');
        $(this).parents('.mfp-wrap').removeClass('is-visible');
        $('.mfp-bg').removeClass('is-visible');
        $html.css({
            'margin-right':'0'
        }).removeClass('lock-html');
        $('.wrapper').removeClass('fixed-input');
        $('.header.sticky').css({
            // 'right':'0'
        });


    });


    if(typeof onSiteEvent == 'function') {
        onSiteEvent('onModalClose');
    }



    showPopup(".header-phone", '.popup__request-call');
    showPopup(".header-email", '.popup__write-to-us');
    showPopup(".js-header-cabinet", '.popup-authorization');
    showPopup(".header-city > a", '.popup-city');
    showPopup(".header-mobile__city", '.popup-city');
    showPopup(".c-card-cafe__menu", '.popup__menu');
    showPopup(".c-card-vacancy .c-button", '.popup__vacancy');
    showPopup(".c-card_menu", '.popup__menu');
    // showPopup(".c-reviews-positive", '.popup__review');
    // showPopup(".c-reviews-negative", '.popup__review');
    showPopup(".footer-reviews__icon", '.popup__review');
    // showPopup(".popup-forgot-password", '.popup__recovery-password');
    // showPopup(".catalog-product .c-card-catalog__img", '.popup-product');
    // showPopup(".catalog-product .c-card-catalog__title", '.popup-product');
    showPopup(".js-show-product-order", '.popup-product');
    showPopup(".js-show-pie-order", '.popup-pie');
    showPopup("#loadCake", '.popup-cake-order');
    showPopup(".cake-card__hover", '.popup-cake-order');
    showPopup(".js-easter-btn", '.popup-cake-order');
    showPopup("#lk-profile-subscription-del__ok", '.popup-subscription-del');
    showPopup(".js-party-order", '.popup-party-order');
    showPopup(".c-card-event__link--more", '.popup-event');
    showPopup(".c-card-event__link--basket", '.popup-event-basket');
    showPopup(".c-card-event__link--one-click", '.popup-event-one-click');
    showPopup(".excursion-btn", '.popup-excursion-order');

    showPopup(".js-show-cake-order", '.popup-cake-order');
    showPopup(".js-show-pie-order", '.popup-pie');
    showPopup(".js-show-poster", '.popup-poster');
    showPopup(".calendar-box__link", '.popup-calendar-booking');
    showPopup(".calendar-box__wraplink", '.popup-calendar-booking');


    showPopup(".calendar-nav-hall__decor-blue:not(.no-popup)", '.popup__gallery_hall_blue');
    showPopup(".calendar-nav-hall__decor-red:not(.no-popup)", '.popup__gallery_hall_red');
    showPopup(".c-card-new-year__box", '.popup-new-year');

    // $(document).on('click', '#cake-order-issue', function (e) {
    //     e.preventDefault();
    //     $(this).parents('.popup-cake-order').removeClass('is-visible');
    //     $('.popup-cake-order-congratulation').addClass('is-visible');
    // });

    $(document).on('click', '.c-card-event__btn--click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-event').removeClass('is-visible');
        $('.popup-event-one-click').addClass('is-visible');
    });

    $(document).on('click', '#pie-order__one-click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-pie').removeClass('is-visible');
        $('.popup-pie-one-click').addClass('is-visible');
    });

	$(document).on('click', '.factory-point .c-button', function (e) {
        e.preventDefault();
        $(this).parents('.factory-point .popup').removeClass('is-visible');
        $('.popup-gallery').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('html').css({
            'margin-right':'0'
        }).addClass('lock-html');

        if(windowWidth > documentWidth){
            $('html').css({
                'margin-right':'17px'
            });
            $('.mfp-wrap').css({
                'overflow-y':'scroll'
            });
            // console.log('Есть полоса прокрутки');
        }

    });

    $(document).on('click', '.c-card-event__btn--basket', function (e) {
        e.preventDefault();
        $(this).parents('.popup-event').removeClass('is-visible');
        $('.popup-event-basket').addClass('is-visible');
    });

    // $(document).on('click', '.popup-forgot-password', function (e) {
    //     e.preventDefault();
    //     $(this).parents('.popup-authorization').removeClass('is-visible');
    //     $('.popup__recovery-password').addClass('is-visible');
    // });


    $('.popup-authorization .popup-authorization__reg').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-authorization').removeClass('is-visible');
        $('.popup-reg').addClass('is-visible');
    });

    $('.popup-reg .popup-authorization__auth').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-reg').removeClass('is-visible');
        $('.popup-authorization').addClass('is-visible');
    });

    /*мобильные кнопки показа попапов Регистрация/Авторизация*/
    $("#mobile-reg").click(function (e) {
        e.preventDefault();
        $('.popup').removeClass('is-visible');
        $('.popup-reg').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('body').addClass('fixed-input');
        $('html').addClass('lock-html');
        $(this).parents('.header-mobile__auth').removeClass('.popup-slide__show');
    });

    $("#mobile-auth").click(function (e) {
        e.preventDefault();
        $('.popup').removeClass('is-visible');
        $('.popup-authorization').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('body').addClass('fixed-input');
        $('html').addClass('lock-html');
        $(this).parents('.header-mobile__auth').removeClass('.popup-slide__show');
    });




    /*поиск в шапке*/
    $(".header-search .icon-search, .header-search .symbol-search").click(function (e) {
        e.preventDefault();
        $('.header-search__form').toggleClass('is-visible');
        $('.header-search-result').toggleClass('is-visible');
    });

    /*показ мобильного поиска*/
    $(".header-mobile__search .icon-search, .header-mobile__search .symbol-search").click(function (e) {
        e.preventDefault();
        $('.header-mobile__search-box').show();
        $('.header-mobile__menu').hide();
        $('.header-mobile__search .icon-search, .header-mobile__search .symbol-search').hide();
        $('.icon-search-mobile').show();
        $('.header-mobile__search-input').focus();
        $('.header-mobile__auth').removeClass('popup-slide__show');
        // $('.header').addClass('header-top__hide');
    });

    /*скрываем мобильный поиск*/
    $(".icon-search-mobile").click(function (e) {
        e.preventDefault();
        $('.header-mobile__search-box').hide();
        $('.header-mobile__menu').show();
        $('.header-mobile__search .icon-search').show();
        $('.header-mobile__search .symbol-search').show();
        $(this).hide();
        // $('.header').removeClass('header-top__hide');
    });

    $(document).mouseup(function (e) { // событие клика по веб-документу
        var div = $('.header-mobile__search-box'); // тут указываем ID элемента
        if (!div.is(e.target) // если клик был не по нашему блоку
            && div.has(e.target).length === 0) { // и не по его дочерним элементам

            $('.header-mobile__menu').show();
            $('.header-mobile__search-box').hide();
            $('.header-mobile__search .icon-search').show();
            $('.header-mobile__search .icon-search-mobile').hide();
            // $('.header').removeClass('header-top__hide');
        }
    });

    // закрытие по клику все области экрана
    $(".popup-bg").click(function (e) {
        e.preventDefault();
        $('.popup').parents().removeClass('is-visible');
        // $('.fixed-overlay').removeClass('is-visible');
        $('html').removeClass('body-popup');
    });




    /*клик вне области экрана для корзины*/
    function hidePopup (element, instrumentHide){
        $(document).mouseup(function (e) { // событие клика по веб-документу
            var div = $(element); // тут указываем ID элемента
            if (!div.is(e.target) // если клик был не по нашему блоку
                && div.has(e.target).length === 0) { // и не по его дочерним элементам
                div.removeClass(instrumentHide); // скрываем его
                // $('.fixed-overlay').removeClass('is-visible');
                // $('body').removeClass('body-popup');
            }
        });
    }

    // событие клика по веб-документу
    // $(document).mouseup(function (e) {
    //
    //     var popup = $('.popup');
    //     if (!popup.is(e.target)
    //         && !popup.has(e.target).length
    //         && !$('.popup-mini').is(e.target)
    //     ) {
    //         popup.parents('.mfp-wrap').removeClass('is-visible');
    //         $('.mfp-bg').removeClass('is-visible');
    //         $('html').css({
    //             'margin-right':'0'
    //         }).removeClass('lock-html');
    //     }
    // });

    /*скрываем попапы вне зоны элемента для карточки товара*/
    $(document).mousedown(function (e) { // событие клика по веб-документу
        // var div = $('.popup');
        // тут указываем ID элемента
        // var div2 = $('.popup-mini');


        function hideOutZone(elem, elem2, elem3, elem4, elem5){
            var div = $(elem);
            var div2 = $(elem2);
            var div3 = $(elem3);
            var div4 = $(elem4);
            var div5 = $(elem5);
            if (!div.is(e.target)
                && div.has(e.target).length === 0
                && !div2.is(e.target)
                && div2.has(e.target).length === 0
                && !div3.is(e.target)
                && div3.has(e.target).length === 0
                && !div4.is(e.target)
                && div4.has(e.target).length === 0
                && !div5.is(e.target)
                && div5.has(e.target).length === 0){
                // div.removeClass(instrumentHide); // скрываем его
                // console.log('true');
                if ($('.popup-graduation').hasClass('is-visible')) {
                    $.cookie("graduation", "1", {path: '/', expires: 3});
                }

                div.parents('.mfp-wrap').removeClass('is-visible');
                div.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div.parents('html').removeClass('lock-html').css('margin-right','0');
                // div.find('.popup-close').trigger('click');

                var url = localStorage.getItem('backUrl');
                if (url !== null) {
                    window.history.pushState(null, null, url);
                    localStorage.removeItem("backUrl");
                    window.cakeCartItem = {};
                }



                div2.parents('.mfp-wrap').removeClass('is-visible');
                div2.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div2.parents('html').removeClass('lock-html').css('margin-right','0');

                div3.parents('.mfp-wrap').removeClass('is-visible');
                div3.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div3.parents('html').removeClass('lock-html').css('margin-right','0');

                div4.parents('.mfp-wrap').removeClass('is-visible');
                div4.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div4.parents('html').removeClass('lock-html').css('margin-right','0');

                div5.parents('.mfp-wrap').removeClass('is-visible');
                div5.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div5.parents('html').removeClass('lock-html').css('margin-right','0');
            }

        }



        // if (localStorage.getItem('backUrl') !== null) {
        //     var serialObj = JSON.stringify(backUrl);
        //     window.history.pushState(null, null, '/easter/');
        //     localStorage.setItem('backUrl', serialObj);
        //
        //     localStorage.removeItem("backUrl");
        // } else {
        //     return false;
        // }




        if (e.which === 1) {
            hideOutZone('.popup', '.popup-mini', '.datepicker', '.main-user-consent-request-popup', '.fancybox-container');
        }

    });


    hidePopup('.popup-basket', 'popup-slide__show');
    hidePopup('.header-mobile__auth', 'popup-slide__show');
    hidePopup('.header-search__form', 'is-visible');
    hidePopup('.header-search-result', 'is-visible');
    hidePopup('.c-breadcrumb-dropdown__layout', 'is-visible');
    hidePopup('.c-breadcrumb-word__active', 'open');


    /*юоковые кнопки отзыва*/
    var $reviews_btn = $(".c-reviews__btn"),
        clickCount;
    $reviews_btn.attr("data-count", "0");
    var isMobile = {
        Android:        function() { return navigator.userAgent.match(/Android/i) ? true : false; },
        BlackBerry:     function() { return navigator.userAgent.match(/BlackBerry/i) ? true : false; },
        iOS:            function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false; },
        Windows:        function() { return navigator.userAgent.match(/IEMobile/i) ? true : false; },
        any:            function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());  }
    };
    if ( isMobile.any() ) {
        $reviews_btn.on("click", function(){
            clickCount = $(this).attr("data-count");
            clickCount ++;
            $(this).parent('.c-reviews__item').siblings().removeClass('active');
            if (clickCount == 1) {
                $(this).attr("data-count", clickCount);
                $(this).parent('.c-reviews__item').addClass('active');
                return false;
            } else if (clickCount == 2){
                $(this).parent('.c-reviews__item').removeClass('active');
                $(this).attr("data-count", "0");
                showPopup(".c-reviews-positive", '.popup__review');
                showPopup(".c-reviews-negative", '.popup__review');
            }else {
                return true;
            }
        });
    }

    if ( !isMobile.any() ) {
        $reviews_btn.hover(function(){
            clickCount = $(this).attr("data-count");
            clickCount ++;
            $(this).parent('.c-reviews__item').siblings().removeClass('active');
            if (clickCount == 1) {
                $(this).attr("data-count", clickCount);
                $(this).parent('.c-reviews__item').addClass('active');
                return false;
            } else if (clickCount == 2){
                showPopup(".c-reviews-positive", '.popup__review');
                showPopup(".c-reviews-negative", '.popup__review');
                $(this).parent('.c-reviews__item').removeClass('active');
                $(this).attr("data-count", "0");
            }else {
                return true;
            }
        });
    }


    // мобильный заказать звонок, показываем форму и удаляем надпись
    $(".mobile-request-call_inquiry").click(function (e) {
        e.preventDefault();
        $(this).css({
            'opacity': '0',
            'visibility': 'hidden',
            'display':'none'
        });
        $('.mobile-request-call__form').css({
            'opacity': '1',
            'visibility': 'visible',
            'display':'block'
        });
    });

    /*соглашение на обработку персональных данных*/
    function DisabledFormButton(form, check, btn_form){
        $("form input[type='checkbox']").on('change', function(){
            if($(check).prop('checked')){
                $(btn_form).removeAttr('disabled');
                // console.log('check');
            }else {
                $(btn_form).attr('disabled', 'disabled');
                // console.log('check else');
            }
        });
    }

    DisabledFormButton('#popup-reg','#reg__regulations','#popup-reg button');
    DisabledFormButton('#popup__write-to-us','#write-to-us__regulations','#popup__write-to-us button');
    DisabledFormButton('#popup__request-call','#request-call__regulations','#popup__request-call button');
    DisabledFormButton('#popup__vacancy','#vacancy__regulations','#popup__vacancy button');
    DisabledFormButton('#order-auth-new','#order-auth-new__regulations','#order-auth-new button');
    DisabledFormButton('#cake-order-form','#cake-order__regulations','#cake-order-form button');
    DisabledFormButton('#excursion-form','#excursion__regulations','#excursion-form button');



    /*показываем в попапе заказать звонок список городов*/
    $(".mobile-request-call_city").on('click', function (e) {
        e.preventDefault();
        console.log('click click');
        // $('.popup-request-city').show();
        $('.popup-request-city').addClass('popup-show');
    });

    $(".popup-request-city").click(function (e) {
        e.preventDefault();
        $('.popup-request-city').removeClass('popup-show');
        // $('.popup-request-city').hide();
        $('.popup__request-call').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('html').css({
            'overflow':'hidden',
            'margin-right':'17px'
        });
    });

    /*попап корзины*/
    $('.icon-basket, .header .symbol-basket, .header .symbol-basket-2, .header-basket__count').on('click', function () {
        $('.popup-basket').addClass('popup-slide__show');
        $('.header').addClass('header-top__no-hide');
        // $('html').addClass('lock-html');
    });

    $('.popup-basket__close').on('click', function () {
        $('.popup-basket').removeClass('popup-slide__show');
        $('.header').removeClass('header-top__no-hide');
    });

    $('.popup-basket__scroll').on( 'mousewheel DOMMouseScroll', function (e) {

        var e0 = e.originalEvent;
        var delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });


    /*проверяет в фильтре наличие селекта и еслит есть делает родитель блочным для отображения в мобильной версии*/
    $('.filter').each(function(){
        var $filterBody =  $('.filter-item__body');
        $filterBody.has('select').css('display', 'block');
        $filterBody.has('input[type="text"]').css('display', 'block');
        $filterBody.has('select').parents('.filter-item').css('border','none');
        $filterBody.has('input[type="text"]').parents('.filter-item').css('border','none');
    });

    /*появление фильтра в мобильной версии*/

    function ShowMobileBtnFilter (btn, showBlock) {
        $(btn).on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass('dropdown-show');
            $(this).siblings(showBlock).slideToggle(200);

        });
    }
    ShowMobileBtnFilter('.filter-mobile-btn', '.filter');
    ShowMobileBtnFilter('.filter-mobile-btn', '.reviews-form');
    ShowMobileBtnFilter('.filter-hold-mobile-btn', '.filter-hold');

    $('.filter-mobile-btn').on('click', function (e) {
        e.preventDefault();
        $('.filter-more').toggleClass('active');
        console.log('filter more');
    });

    /*показ подменю в мобильной версии меню*/
    $('.header-mobile__list .icon-dropdown').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('dropdown-show');
        $(this).siblings('.header-mobile__sublist').slideToggle(200);
        $(this).parents('.header-mobile__item').toggleClass('active');
    });

    /*функция счета больше/меньше*/
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
    // catalogItemCounter('.fieldCount');

   /*мобильное меню*/
	$('.header-mobile__menu').on('click', function(){
		$(this).toggleClass('icon-menu__transform');
		$('.header-mobile__dropdown').toggleClass('popup-show');
		// $('.header').toggleClass('header-top__hide');
        $('html').toggleClass('overflow');
        $('.c-reviews__item').toggleClass('is-hide');


        if($('.header').hasClass('sticky')){
            $('.header-mobile__dropdown').addClass('menu-sticky');
        }else {
            $('.header-mobile__dropdown').removeClass('menu-sticky');
        }
	});
    // $('.header').hasClass('.sticky').children('.header-mobile__dropdown').addClass('menu-sticky');

    $('.header-mobile__dropdown-close').on('click', function(){
        $('.header-mobile__menu').toggleClass('icon-menu__transform');
        $('.header-mobile__dropdown').toggleClass('popup-show');
        $('html').removeClass('overflow');
        $('.c-reviews__item').removeClass('is-hide');
	});


	$('.header-mobile__cabinet').on('click', function(){
		$('.header-mobile__auth').toggleClass('popup-slide__show');
	});

    //кнопка вверх
    function backToTop (btnElem, parentElem){
        var offset = 300,
            offset_opacity = 1200,
            scroll_top_duration = 700,
            $back_to_top = $(btnElem);
        //кнопка назад
        $(window).scroll(function(){
            ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
            if( $(this).scrollTop() > offset_opacity ) {
                $back_to_top.addClass('cd-fade-out');
            }
        });

        $back_to_top.on('click', function(event){
            event.preventDefault();
            $(parentElem).animate({
                    scrollTop: 0
                }, scroll_top_duration
            );
        });
    }

    backToTop('.cd-top', 'body,html');
    backToTop('.popup-product__btn-back', '.popup');


    var wrapperHeight = parseInt($('.wrapper').height());
    /*липкая шапка*/
    $(window).scroll(function(){
        var bo = $(window).scrollTop();
        var $header = $(".header");
        var $headerWrap = $(".header-wrap");
        var $logo = $("#symbol-logo");
        var $headerHeight = $headerWrap.height();
        if ( bo >= 1 ) {/*значение при котором не дергается ничего 106*/
            $header.addClass('header-top__hide');
            // $header.addClass('sticky');
            $headerWrap.addClass('sticky');
            $logo.addClass('fixed-logo');

            $('main').css({
                'padding-top': $headerHeight
            });
            // $header.addClass('fixed-header');
        } else {
            $header.removeClass('header-top__hide');
            // $header.removeClass('sticky');
            $headerWrap.removeClass('sticky');
            $logo.removeClass('fixed-logo');
            // $header.removeClass('fixed-header');
            $('main').css({
                'padding-top': '0'
            });
        }

        // console.log('высота wrapperHeight: ' + wrapperHeight)
        if( wrapperHeight + 10 > documentHeight){
            $('.wrapper').css({
                'padding-bottom': '7rem'
            })
        }

        if( wrapperHeight + 300 > documentHeight){
            $('.wrapper').css({
                'padding-bottom': '0'
            })
        }
    });

    /*кастомный селект*/
    $('.c-select').SumoSelect( {
        forceCustomRendering: false
    });


    $('.c-select--search').SumoSelect( {
        forceCustomRendering: false,
        search: true,
        searchText: 'Искать...'
    });

    $('.c-select--multiply').SumoSelect( {
        forceCustomRendering: false,
        placeholder: 'Выберите...',
        selectAll: true
    });

    function showNegative(clickElem){
        $(clickElem).on('click', function(){
            var select = $('.popup__review .c-select');
            select.val('48');
            select[0].sumo.reload();
            // select[0].sumo.selectItem('48');
            var $icon = select.parents('.reviews-form__type').find('.reviews-form__type-icon');
            $icon.removeClass('icon-rabbit-positive');
            $icon.addClass('icon-rabbit-negative');
            // console.log('функция сработала при клике js-negative');
            // console.log(select.val());
        });
    }
    showNegative('.js-negative');
    showNegative('.c-reviews-negative');

    function showPositive(clickElem){
        $(clickElem).on('click', function(){
            var select = $('.popup__review .c-select');
            select.val('47');
            select[0].sumo.reload();
            var $icon = select.parents('.reviews-form__type').find('.reviews-form__type-icon');
            $icon.removeClass('icon-rabbit-negative');
            $icon.addClass('icon-rabbit-positive');
            // select[0].sumo.selectItem('47');
            // console.log('функция сработала при клике js-positive');
            // console.log(select.val());
        });
    }
    showPositive('.js-positive');
    showPositive('.c-reviews-positive');



    function changeRabbitFace (select){
        $(select).on("change",function() {
            var valReview = $(this).val();
            var $icon = $(this).parents('.reviews-form__type').find('.reviews-form__type-icon');

            if (valReview == 48 ) {
                $icon.removeClass('icon-rabbit-positive');
                $icon.addClass('icon-rabbit-negative');
            } else {
                $icon.removeClass('icon-rabbit-negative');
                $icon.addClass('icon-rabbit-positive');
            }
        });
    }

    changeRabbitFace('#form_dropdown_SIMPLE_QUESTION_257');

    function changeSelectFace (select, value, icon_1, icon_2){
        $(select).on("change",function() {
            var valReview = $(this).val();
            var $icon = $(this).parents('.c-select-layout').find('.c-select__icon');
            console.log('changeSelectFace');

            if (valReview == value ) {
                $icon.removeClass(icon_2);
                $icon.addClass(icon_1);
                console.log('boy');
            } else {
                $icon.removeClass(icon_1);
                $icon.addClass(icon_2);
                console.log('girl');
            }
        });
    }

    changeSelectFace('.lk-profile__child-gender', 'M','icon-boy-smiling','icon-girl-smiling');






    /*простые табы*/
    $(document).on('click', '.tabs-menu a', function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $('.tab').find(".tab-content").not(tab).css("display", "none");
        // $(this).parents('.tabs-menu').parent().siblings('.tab').find(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });

    /*scroll*/
    // $(".popup-basket__scroll").scrollBox();
    // $('#scrollbarY').tinyscrollbar();

    /*hover в меню*/
    // $('.header-menu__item--about').hover( function(){
    //    $('.header-subnavigation').addClass('is-visible');
    // });
    //
    // $('.header-subnavigation').mouseleave(function(){
    //     $(this).removeClass('is-visible');
    // });

/*скрол карты*/
    // var target = $('#map');
    // var targetPos = target.offset().top;
    // var winHeight = $(window).height();
    // var scrollToElem = targetPos - winHeight;
    // $(window).scroll(function(){
    //     var winScrollTop = $(this).scrollTop();
    //     if(winScrollTop > scrollToElem){
    //         //сработает когда пользователь доскроллит к элементу с классом .elem
    //         $(window).offset(60);
    //     }
    // });

    /*Порой на страницах с «резиновой» версткой необходимо знать ширину скролбара, чтобы правильно вычислить размеры внутренних элементов и их положение. Эта задача решается с помощью следующего алгоритма:

добавить два div в body и разместить их за пределами экрана;
определить ширину внутреннего div;
установить значение «scroll» свойства overflow у внешнего div;
опять определить ширину внутреннего div;
удалить оба div;
вернуть разницу между измеренными ранее значениями ширины.*/
    // function scrollbarWidth() {
    //     var div = $('<div style="width:50px; height:50px; overflow:hidden; position:absolute; top:-200px; left:-200px;"><div style="height:100px;"></div></div>').appendTo('body');
    //     var w1 = $('div', div).innerWidth();
    //     div.css('overflow-y', 'scroll');
    //     var w2 = $('div', div).innerWidth();
    //     $(div).remove();
    //     return (w1 - w2);
    // }
    //
    // var resScrollWidtn = scrollbarWidth();
    // console.log('Ширина скролбара страницы: ' + resScrollWidtn);

});



    /*-------------------------------------------------------------*/

    /*-------------------------------------------------------------*/

// });

    //------------------------------------------------------------custom###
//
// 	$body = $('body');
// 	windowWidth = $(window).width();
// 	windowHeight = $(window).height();
//
// 	pageWidget(['index']);
// 	getAllClasses('html','.elements_list');
// });
//
// $(window).on('load', function () {
// 	loadFunc();
// });
//
// $(window).on('resize', function () {
// 	resizeFunc();
// });
//
// $(window).on('scroll', function () {
// 	scrollFunc();
// });
//
// function loadFunc() {
//
// }
// function resizeFunc() {
// 	updateSizes();
// }
//
// function scrollFunc() {
// 	updateSizes();
// }
//
// function updateSizes() {
// 	windowWidth = $(window).width();
// 	windowHeight = $(window).height();
// }

// if ('objectFit' in document.documentElement.style === false) {
// 	document.addEventListener('DOMContentLoaded', function () {
// 		Array.prototype.forEach.call(document.querySelectorAll('img[data-object-fit]'), function (image) {
// 			(image.runtimeStyle || image.style).background = 'url("' + image.src + '") no-repeat 50%/' + (image.currentStyle ? image.currentStyle['object-fit'] : image.getAttribute('data-object-fit'));
//
// 			image.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'' + image.width + '\' height=\'' + image.height + '\'%3E%3C/svg%3E';
// 		});
// 	});
// }

//Functions for development
// function getAllClasses(context, output) {
// 	var finalArray = [],
// 		mainArray = [],
// 		allElements = $(context).find($('*'));//get all elements of our page
// 	//If element has class push this class to mainArray
// 	for (var i = 0; i < allElements.length; i++) {
// 		var someElement = allElements[i],
// 			elementClass = someElement.className;
// 		if (elementClass.length > 0) {//if element have not empty class
// 			//If element have multiple classes - separate them
// 			var elementClassArray = elementClass.split(' '),
// 				classesAmount = elementClassArray.length;
// 			if (classesAmount === 1) {
// 				mainArray.push('.' + elementClassArray[0] + ' {');
// 			} else {
// 				var cascad = '.' + elementClassArray[0] + ' {';
// 				for (var j = 1; j < elementClassArray.length; j++) {
// 					cascad += ' &.' + elementClassArray[j] + ' { }';
// 				}
// 				mainArray.push(cascad);
// 			}
// 		}
// 	}

	//creating finalArray, that don't have repeating elements
// 	var noRepeatingArray = unique(mainArray);
// 	noRepeatingArray.forEach(function (item) {
// 		var has = false;
// 		var preWords = item.split('&');
// 		for (var i = 0; i < finalArray.length; ++i) {
// 			var newWords = finalArray[i].split('&');
// 			if (newWords[0] == preWords[0]) {
// 				has = true;
// 				for (var j = 0; j < preWords.length; ++j) {
// 					if (newWords.indexOf(preWords[j]) < 0) {
// 						newWords.push(preWords[j]);
// 					}
// 				}
// 				finalArray[i] = newWords.join('&');
// 			}
// 		}
// 		if (!has) {
// 			finalArray.push(item);
// 		}
// 	});
// 	for (var i = 0; i < finalArray.length; i++) {
// 		$('<div>' + finalArray[i] + ' }</div>').appendTo(output);
// 	}
//
// 	//function that delete repeating elements from arrays, for more information visit http://mathhelpplanet.com/static.php?p=javascript-algoritmy-obrabotki-massivov
// 	function unique(A) {
// 		var n = A.length, k = 0, B = [];
// 		for (var i = 0; i < n; i++) {
// 			var j = 0;
// 			while (j < k && B[j] !== A[i]) j++;
// 			if (j == k) B[k++] = A[i];
// 		}
// 		return B;
// 	}
// }
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

/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

'use strict';

;( function ( document, window, index )
{
    var inputs = document.querySelectorAll( '.c-inputfile__input' );
    Array.prototype.forEach.call( inputs, function( input )
    {
        var label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener( 'change', function( e )
        {
            var fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
                label.querySelector( 'span' ).innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });

        // Firefox bug fix
        input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
        input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
    });
}( document, window, 0 ));


$(function(){
    // Custom readmore
    var obj = $(".cake-order-composition");
    var collapsed = true;
    obj.attr('collapsed', collapsed);
    var moreString = '<a href="#" class="mrm-more"></a>';
    var lessString = '<a href="#" class="mrm-less"></a>';
    obj.append(moreString);
    obj.append(lessString);
    obj.find('a.mrm-more').show();
    obj.find('a.mrm-less').hide();

    obj.find('a.mrm-more').on('click',function(event){
        event.preventDefault();
        var collapsed = false;
        obj.find('a.mrm-less').show();
        obj.find('a.mrm-more').hide();
        obj.attr('collapsed', collapsed);

    });
    obj.find('a.mrm-less').on('click',function(event){
        event.preventDefault();
        var collapsed = true;
        obj.find('a.mrm-more').show();
        obj.find('a.mrm-less').hide();
        obj.attr('collapsed', collapsed);

    });



    // Show Hint
    $('#pie-order-form > div.popup-body > div.cake-order-time > div:nth-child(3)').append($('<div class="close"></div>'));

    var hintPanel = $('#pie-order-form > div.popup-body > div.cake-order-time > div:nth-child(3)');

    $('.delivery-date-hint').on('click',function() {

        if(hintPanel.hasClass('show-hint')) {
            hintPanel.removeClass("show-hint");
        } else {
            hintPanel.addClass("show-hint");
        }
    });

    hintPanel.find('.close').on('click', function() {
        hintPanel.removeClass("show-hint");
    });


    // #region disable dialogbox and hints

    function hideHints() {
        $('#pie-order-form > div.popup-body > div.cake-order-time > div:nth-child(3)').removeClass("show-hint");
    }

    function hideDatepicker() {
        $('#cake-order-date').datepicker().data('datepicker').hide();
    }
    // #endregion disable dialogbox and hints

    // Scroll form
    $('.mfp-wrap.popup-pie-one-click').on('scroll', function(){
        hideHints();
        hideDatepicker();
    });


    // Click on form with except
    $('.popup-pie-one-click .mfp-content').on('click', function(event) {
        if($(event.target).hasClass('delivery-date-hint') ||
            $(event.target).hasClass('c-form__attention')
        ) {
            //clicked on hint
        } else {
            hideHints();
        }
    });

    // Collapse nav menu
    //c-card-slide__dropdown
    var carretHTML = `
    <a href="#" class="nav-dropdown">
        <i class="icon-dropdown">
            <svg class="icon-dropdown__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.54 68.83">
                <path d="M46.65,23.71c-2.19-2-4.42-3.89-6.71-5.76C31,10.61,18.61-.11,6.22,2.69c-4.43,1-7.1,6.07-6,10.37,3,11,13.81,17.08,22.07,24.06C33.06,46.17,42.88,56,52.87,65.85c3.61,3.54,10.81,4,14.8.86,7.56-6,20.49-14.33,27.53-21,15.48-12.05,29.38-26,29.33-35,.33-7-4.2-10.14-7.33-10.67-8.32-1.41-27,17.75-35.67,25.67C77.38,28.58,69.22,35.58,65,38.28"></path>
            </svg>
        </i>
    </a>
    `;

    $('.pie-mix__item').append(carretHTML);

    var pieNavCollapse = true;
    $('.pie-mix a.nav-dropdown').on('click',function() {
        pieNavCollapse = !pieNavCollapse;

        if(pieNavCollapse) {
            $(this).removeClass('active');
            $('.pie-mix a.pie-mix__item').not('.mixitup-control-active').hide();
        } else {
            $(this).addClass('active');
            $('.pie-mix a.pie-mix__item').not('.mixitup-control-active').show();
        }



        // $('.pie-mix a.pie-mix__item:not(.mixitup-control-active)').hide();

        // if(pieNavCollapse) {
        //     pieNavCollapse = false;
        //     $('.pie-mix a.pie-mix__item').show();
        // } else {
        //     pieNavCollapse = true;
        //     $('.pie-mix a.pie-mix__item:not(.mixitup-control-active)').hide();
        // }

    });



});


/* holiday space list */
$(function() {
    /* show more */
    
    /* settings*/
    // var $target = $('.show-more-target');
    // var $control = $('.show-more');
    // var target_item_selector = 'div.c-col';
    // var hsl_start_count = 0;
    //
    // var hsl_sizer = {
    //     0: {
    //         start_count: 3,
    //     },
    //     420: {
    //         start_count: 3,
    //     },
    //     620: {
    //         start_count: 4,
    //     },
    //     940: {
    //         start_count: 6,
    //     },
    //     1225: {
    //         start_count: 8,
    //     },
    // };
    /* end settings */

    // var show_more_state_collapsed = true;
    // var target_count = $target.find(target_item_selector).length;
    //
    // for (var propName in hsl_sizer) {
    //     if($(window).width() > propName) {
    //         hsl_start_count = hsl_sizer[propName].start_count;
    //     }
    // }
    //
    // $(window).on('resize', function() {
    //     for (var propName in hsl_sizer) {
    //         if($(window).width() > propName) {
    //             hsl_start_count = hsl_sizer[propName].start_count;
    //         }
    //     }
    //     if(show_more_state_collapsed) {
    //         if (hsl_start_count < target_count) {
    //             $target.find(target_item_selector).each(function (index, elem) {
    //                 index >= hsl_start_count ? $(elem).hide() : $(elem).show();
    //             });
    //         }
    //     }
    //
    // });

    // $control.find('a').on('click', function(event) {
    //     event.preventDefault();
    //     show_more_state_collapsed = !show_more_state_collapsed;
    //
    //     $target.find(target_item_selector).each(function(index, elem) {
    //         if(show_more_state_collapsed) {
    //             index >= hsl_start_count ? $(elem).hide(): $(elem).show();
    //         } else {
    //             $(elem).show();
    //         }
    //     });
    //
    //     if (show_more_state_collapsed) {
    //         $control.find('a').html('показать ещё');
    //     } else {
    //         $control.find('a').html('скрыть');
    //     }
    //

    //        if(current > target_count) $control.hide();
    // });
    //
    //
    //
    // if(hsl_start_count < target_count) {
    //     $target.find(target_item_selector).each(function(index, elem) {
    //         index >= hsl_start_count ? $(elem).hide(): $(elem).show();
    //     });
    // }

    /* end show more */



    $('.popup-fotorama').fotorama({
        width: '100%',
        ratio: 16/9,
        loop: true,
        thumbwidth: 88,
        allowfullscreen: false,
        nav: 'thumbs',
        fit:'cover'
    });

    if($('ul').hasClass('calendar-selector__list')){
        /* Calendar Selector */
        new SimpleBar($('.calendar-selector__list')[0], {
            autoHide: false,
            scrollbarMinSize: 35
        });


        var holiday_calendar = $('.holiday .calendar');

        if(holiday_calendar.height() < 130) {
            holiday_calendar.find('.calendar-selector').addClass('show-up');
        }
        var loft_calendar = $('.loft-booking .calendar');

        if(loft_calendar.height() < 130) {
            loft_calendar.find('.calendar-selector').addClass('show-up');
        }
    };


    $('.calendar-title__wrapper').on('click', function (event) {
        event.preventDefault();
        $('#hsl-addr-selector').toggleClass('calendar-selector_hidden');
        $('.calendar-title__wrapper .calendar-title__control svg').toggleClass('calendar-title__control_flip');
    });

    $('#hsl-year-selector-init').on('click', function (event) {
        event.preventDefault();
        $('#hsl-year-selector').toggleClass('calendar-selector_hidden');
    });

    // resize top modal (1 or 2 line text etc)
    function resizeSelectorHead(target, delta = 21) {
        let $_wrapper = $(target).closest('.calendar-selector_wrapper');
        let $_elem = $(target).find('.calendar-selector__head');
        if($_elem.height() !== ($_wrapper.height() + delta)) {
            $_elem.css('height', ($_wrapper.height() + delta) / 10 + "rem")
        }
    }

    resizeSelectorHead('#hsl-addr-selector');

    $(window).on('resize', function() {
        resizeSelectorHead('#hsl-addr-selector');
    });




    // hide on click other element
    function hideSelector(target_selector, event) {
        let elemclass = $(event.target).attr('class');
        let elemid = $(event.target).attr('id');
        if(!elemid) elemid = '';
        if(!elemclass) elemclass = '';

        if(!$(target_selector).hasClass('calendar-selector_hidden'))
            if ((elemclass.indexOf('calendar-selector') === -1) &&
                (elemclass.indexOf('simplebar') === -1) &&
                (elemclass.indexOf('calendar-navigator__year') === -1) &&
                (elemid.indexOf('hsl-year-selector-init') === -1) &&
                (elemclass.indexOf('calendar-title__caption') === -1) &&
                (elemclass.indexOf('calendar-title__wrapper') === -1) &&
                (elemclass.indexOf('calendar-title__caption') === -1) &&
                (elemclass.indexOf('calendar-title__control') === -1)
            ) {
                $('.calendar-selector').addClass('calendar-selector_hidden');
                // arrow transform
                $('.calendar-title__wrapper .calendar-title__control svg').removeClass('calendar-title__control_flip');

            }
    }

    $(document).on('click', function(event) {
        hideSelector('#hsl-addr-selector', event);
        hideSelector('#hsl-year-selector', event);
    });


    // filter on input
    $('.calendar-selector__input').on('change paste keyup', function(event) {

        var filter_value =  $('.calendar-selector__input').val();
        var $elem_target = $(this).closest('.calendar-selector').find('.calendar-selector__list');

        if(filter_value) {
            $elem_target.find('li').each(function (index, element) {
                if ($(element).find('a').html().toLowerCase().indexOf(filter_value.toLowerCase()) !== -1) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            });
        } else {
            $elem_target.find('li').each(function (index, element) {
                $(element).show();
            });
        }
    });
    // Calendar Hall Row Events
    //      options
/*
    let hsl_calendar_options = {
        selector_owlCarousel: '.calendar-nav-hall__row',
        selector_column: '.calendar-col',
        selector_box: '.calendar-box',
        selector_nav_column: '.calendar-nav',
        selector_nav_box: '.calendar-nav-time',
        class_hidden: 'calendar-adapt_hidden',
        time_slot_count: 3,
    };

    //      init
    calendarHallUpdateGrid(
        hsl_calendar_options.selector_column,
        hsl_calendar_options.selector_box,
        hsl_calendar_options.time_slot_count,
        0,
        hsl_calendar_options.class_hidden
    );

    calendarHallUpdateGrid(
        hsl_calendar_options.selector_nav_column,
        hsl_calendar_options.selector_nav_box,
        hsl_calendar_options.time_slot_count,
        0,
        hsl_calendar_options.class_hidden
    );

    calendarHallUpdateBind(hsl_calendar_options);
*/
});

// Calendar Hall Row Events
//      hide&show
/*
function calendarHallUpdateGrid(sel_column, sel_box, time_slot_count, page_index, class_hidden) {
    $(sel_column).each(function(index, element) {
        $(element).find(sel_box).each(function(j, box) {
            if((j >= time_slot_count * page_index) &&
                (j < (time_slot_count * page_index + time_slot_count))) {
                $(box).removeClass(class_hidden);
            } else {
                $(box).addClass(class_hidden);
            }
        });
    });
}

//    bind event
function calendarHallUpdateBind(options) {
    let owl = $(options.selector_owlCarousel);
    owl.trigger('destroy.owl.carousel');
    owl.owlCarousel({
        items: 1,
        loop: true,
        center: true,
        autoHeight: true,
        nav: true
    });


    owl.on('changed.owl.carousel', function(event) {
        calendarHallUpdateGrid(
            options.selector_column,
            options.selector_box,
            options.time_slot_count,
            event.page.index,
            options.class_hidden
        );

        calendarHallUpdateGrid(
            options.selector_nav_column,
            options.selector_nav_box,
            options.time_slot_count,
            event.page.index,
            options.class_hidden
        );
    })
}
*/

// Holidays All
//  functions
function holidaysInit(selector) {
    $(selector).find('li').each(function(index, elem){
        $(elem).find('.holidays-list-item__caption').on('click', function(){
            if(!$(this).hasClass('holidays-list-item__caption_selected')) {
                $(selector).attr('current', index);
            } else {
                $(selector).attr('current', -1);
            }
            $(this).addClass('holidays-list-item__caption_selected');
            $(elem).find('.holidays-list-item__body').removeClass('holidays-list-item__body_hidden');
            holidaysListCollapse(selector, $(selector).attr('current'));
        });
    });
}

function holidaysListCollapse(selector, index) {
    $(selector).find('li').each(function(_index, elem) {
        if (_index != index) {
            $(elem).find('.holidays-list-item__caption').removeClass('holidays-list-item__caption_selected');
            $(elem).find('.holidays-list-item__body').addClass('holidays-list-item__body_hidden');
        }
    });
}

function holidaysAppleFix() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
            // Chrome
        } else {
            // Safari
            $('.holidays-count__number').addClass('holidays-apple-fix');
        }
    }
}

//      gridPosition
function customGridRefreshPosition(container, block, cols = 'auto') {
    let container_width = $(container).width();
    let map = [];

    let cont = { height_u: 0, width_u: 0};

    let minWidth = container_width;
    let minHeight = 10000;
    let block_count = $(block).length;

    $(block).each(function(index, elem) {
        let $block = $(elem);
        let block_width = $block.outerWidth();
        let block_height = $block.outerHeight();
        if (minWidth > block_width) minWidth = block_width;
        if (minHeight > block_height) minHeight = block_height;
    });

    let map_width = 1;
    if(cols == 'auto') {
        map_width = container_width / (minWidth - 1) >> 0;
    } else {
        map_width = cols;
    }

    for (let i=0; i <= block_count; i++) {
        map[i] = [];
        for (let j=0; j < map_width; j++) {
            map[i][j] = 1;
        }
    }

    $(block).each(function(index, elem) {
        let $block = $(elem);
        let block_width = $block.outerWidth();
        let block_height = $block.outerHeight();
        let block_width_U = Math.round(block_width/minWidth);
        let block_height_U = Math.round(block_height/minHeight);
        let block_position = {x:-1000, y:-1000, cellSum:0};
        let posFindFlag = false;

        for (let i=0; i < map.length; i++) {
            for (let j=0; j < map_width; j++) {

                if(map[i][j] != 0) {
                    block_position.cellSum = block_height_U * block_width_U;
                    for (let k = 0; k < block_height_U; k++) {
                        for (let l = 0; l < block_width_U; l++) {
                            if (((i + k) < map.length) && ((j + l) < map_width))
                                block_position.cellSum -= map[i + k][j + l];
                        }
                    }
                    if (block_position.cellSum == 0) {
                        posFindFlag = true;
                        block_position.x = j * minWidth;
                        block_position.y = i * minHeight;
                        for (let k = 0; k < block_height_U; k++) {
                            for (let l = 0; l < block_width_U; l++) {
                                if (((i + k) < map.length) && ((j + l) < map_width))
                                    map[i + k][j + l] = 0;
                                if(cont.height_u < (i+k)) cont.height_u = i+k;
                                if(cont.width_u < (j+l)) cont.width_u = j+l;
                            }
                        }
                        break;
                    }
                }
            }
            if(posFindFlag) break;
        }
        $block.css('left', block_position.x);
        $block.css('top', block_position.y);
    });

    $(container).css('height',(cont.height_u+1) * minHeight);
}

function initHolidayMobileSlider(){
    var mySlider = $('.holiday-reason__slick');

    if (!mySlider.hasClass('slick-initialized')) {
        mySlider.slick({
            slidesToShow: 3,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 9999,
                    settings: "unslick"
                },
                {
                    breakpoint: 1300,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: false
                    }
                },
                {
                    breakpoint: 740,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: false
                    }
                }
            ]
        });
    }
}


//  events listener
$(function() {
    if($('div').hasClass('holiday-reason__grid')){
        $(window).on('resize orientationchange', function() {

            initHolidayMobileSlider();

    
        });

        initHolidayMobileSlider();
    };

    holidaysInit('.holidays-list__body');
    holidaysAppleFix();



    
});

/*новые скрипты для мобильной версии табло*/

$(function(){
    var calendar_options = {
        selector_owlCarousel: '.calendar-nav-hall__row',
        selector_line: '.newcalendar .calendar-line',
        class_hidden: 'calendar-adapt_hidden',
    };

    //      init
    calendar_HallUpdateGrid(
        calendar_options.selector_line,
        0,
        calendar_options.class_hidden
    );

    calendar_HallUpdateBind(calendar_options);


});

function calendar_HallUpdateGrid(sel_column, page_index, class_hidden) {
    $(sel_column).each(function(index, element) {
        if(index == page_index) {
            $(element).removeClass(class_hidden);
            $(element).siblings().addClass(class_hidden);
        } else {
            $(element).addClass(class_hidden);
            // $(element).siblings.removeClass(class_hidden);
        }
    });
}

//    bind event
function calendar_HallUpdateBind(options) {
    var owl = $(options.selector_owlCarousel);
    owl.trigger('destroy.owl.carousel');
    owl.owlCarousel({
        items: 1,
        loop: true,
        // center: true,
        autoHeight: true,
        nav: true
    });


    owl.on('changed.owl.carousel', function(event) {
        calendar_HallUpdateGrid(
            options.selector_line,
            event.page.index,
            options.class_hidden
        );

        calendar_HallUpdateGrid(
            options.selector_nav_column,
            event.page.index,
            options.class_hidden
        );

        // console.log('event.page.index: ' + event.page.index);
    })
}


/* subscription */
$(function() {

    $('.subscription__select').SumoSelect({
        placeholder: 'Выберите кафе',
        selectAll: true,
        locale: ['Ok', 'Отмена', 'Все'],
        captionFormat: '{0} Выбрано',
        captionFormatAllSelected: '{0} Все',
    });
});
/* /subscription */

/* Cake update - Task #8402  */
    // function


    // bind

$(function() {

    $('.cake-card-stuffing__control_show').on('click', function(event) {
        event.preventDefault();
        $(this).parent().parent().parent().find('.cake-card-stuffing__description').toggle();
        $(this).parent().parent().toggle();
    });

    $('.cake-card-stuffing__control_hide').on('click', function(event) {
        event.preventDefault();
        $(this).parent().parent().toggle();
        $(this).parent().parent().parent().find('.cake-card-stuffing__header').toggle();
    });

});
/*  / Cake update - Task #8402  */

/* Event Builder */
    // function


    // $()

        function initEventBuilderNav (elem){
            if($(window).width() <= 800) {
                $(elem).owlCarousel({
                    loop:false,
                    nav:true,
                    // margin:20,
                    items: 3,
                    center: true,
                    mouseDrag:false,
                    pullDrag:false
                });
                $(elem).addClass('owl-carousel');
            }else {
                $(elem).trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
                $(elem).find('.owl-stage-outer').children().unwrap();
            }
        }
        if($('div').hasClass('top-nav')){
            initEventBuilderNav('.event-builder .top-nav');
            $(window).on('resize', function () {
                initEventBuilderNav('.event-builder .top-nav');
            });
        }


    function topNavClear() {
        $('.top-nav-button').each(function(index, element) {
            $(element).removeClass('top-nav-button_active');
            $(element).removeClass('top-nav-button_visited');
            $(element).css('z-index', 'auto');
        });
    }

    function topNavZIndex() {
        let option = {};
        option.count = $('.top-nav-button').length;
        $('.top-nav-button').not('.top-nav-button_visited').each(function(index, element) {
            option.count -= 1;
            $(element).css('z-index', option.count);
        });
        $('.top-nav-button.top-nav-button_active').css('z-index', $('.top-nav-button').length);
    }

    function topNavVisited() {
        var beforeActive = true;
        $('.top-nav-button').each(function(index, element) {
            if($(element).hasClass('top-nav-button_active')) {
                beforeActive = false;
            }

            if(beforeActive) {
                $(element).addClass('top-nav-button_visited');
            }
        });
    }

    function eventBuilderHideTabs() {
        $('.event-builder-tab').each(function(item,element) {
            $(element).removeClass('event-builder-tab_active');

        });
        $('.event-builder-check').removeClass('event-builder-check_show');
        $('.top-nav').removeClass('top-nav_back');
    }

    function eventBuilderShowTab(tabName) {
        $('.event-builder-tab[data-tab="' + tabName + '"]').addClass('event-builder-tab_active');
        if ($('.event-builder-tab[data-tab="' + tabName + '"]').attr('data-show-check') == 'show') {
            $('.event-builder-check').addClass('event-builder-check_show');
        }
        if ($('.event-builder-tab[data-tab="' + tabName + '"]').attr('data-with-back') == 'true') {
            $('.top-nav').addClass('top-nav_back');
        }
    }

    function eventBuilderCheckLines() {
        $('.event-builder-tab-list-block__line').each(function(index, element) {
            var $counter = $(element).find('input.c-counter__field');
            if($counter.length) {
                if($counter.val() == 0 && $counter.val() != '') {
                    $(element).addClass('event-builder-tab-list-block__line_disable');
                } else {
                    $(element).removeClass('event-builder-tab-list-block__line_disable');
                }
            }

        });
    }

    function eventBuilderProgressBar() {
        $('.event-builder-progressbar').each(function(index, element) {
            $(element).find('.event-builder-progressbar__bar').css('width', (100 - $(element).attr('data-value')) + '%');
        });
    }

    function showPopup(icon, popup) {
        $(document).on('click', icon, function (e) {
            var $html = $('html');
            e.preventDefault();
            $(popup).addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');


            $html.addClass('lock-html');
            $('body').addClass('fixed-input');
            if(windowWidth > documentWidth){
                $html.css({
                    'margin-right':'17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y':'scroll'
                });
                // console.log('Есть полоса прокрутки');
            }else {
                // console.log('Нет полосы прокрутки');
            }
        });
    }

    function eventBuilderCheckRating() {
        $('.event-builder-check-rating-block').each(function(index, element) {
            $(element).find('.event-builder-check-rating:nth-child(' + $(element).attr('data-rating') + ')').addClass('event-builder-check-rating_show');
        });
    }

// Main

$(function() {
    /* init */
    topNavVisited();
    topNavZIndex();
    eventBuilderHideTabs();
    eventBuilderShowTab($('.top-nav-button_active').attr('data-for-tab'));
    eventBuilderCheckLines();
    eventBuilderProgressBar();
    showPopup('.event-builder__icon_1','.popup__gallery_event_item_1');
    showPopup('.event-builder__icon_2','.popup__gallery_event_item_1');
    eventBuilderCheckRating();
    /* events */

    $('.top-nav-button').on('click', function() {
        topNavClear();
        $(this).addClass('top-nav-button_active');
        topNavVisited();
        topNavZIndex();

        eventBuilderHideTabs();
        eventBuilderShowTab($(this).attr('data-for-tab'));
    });

    $('.event-builder-button__collapse').on('click', function () {
        $(this).toggleClass('event-builder-button__collapse_flip');
        $(this).find('.event-builder-button__collapse_text_1').toggle();
        $(this).find('.event-builder-button__collapse_text_2').toggle();
        $(this).closest('.event-builder-tab-list-block').find('.event-builder-tab-list-block__content').toggleClass('event-builder-tab-list-block__content_collapse');
    });

    $('.event-builder-tab-list-block__counter button').on('click', function() {
        eventBuilderCheckLines();
    });
    $('.event-builder-tab-list-block__counter input').on('change keyup', function() {
        eventBuilderCheckLines();
    });




});

/* / Event Builder */

/* Catering */
// function

// main
$(function() {
    $('.catering-fotorama').fotorama({
        width: '100%',
        height: '47.5rem',
        ratio: 16/9,
        loop: true,
        thumbwidth: 88,
        allowfullscreen: false,
        nav: 'thumbs',

    });

    $('.catering-collapse').on('click', function(event) {
        event.preventDefault();
        $(this).closest('.catering-cut').toggle();
    });

    $('#catering-show-calendar').on('click', function(event) {
        event.preventDefault();
        var id = $(this).attr('data-for');
        $('#'+id).show();
    });

    $('.catering-options__show').on('click', function(event) {
        event.preventDefault();
        $(this).siblings('.catering-options__cut').toggle();
        $(this).toggle();
    });

    $('.catering-options__collapse').on('click', function(event) {
        event.preventDefault();
        $(this).closest('.catering-options__cut').siblings('.catering-options__show').toggle();
        $(this).closest('.catering-options__cut').toggle();
    });


});

/* / Catering */
