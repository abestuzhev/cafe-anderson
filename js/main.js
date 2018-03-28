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





    $(document).on('click', '.order-tabs__item', function(){
        changeHeightAddressList();
    });



    var permitPath = [
    '/factory-happiness.html',
    '/cafe-anderson/factory-happiness.html'
    ];

    if(permitPath.indexOf(location.pathname) > -1){
        function getScrollElem (elem){
            if($(window).width() <= 800) {
                new SimpleBar($(elem)[0]);
            }
        }
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


    var disabledPartyDays = [0, 6];
    $('#party-datepicker').datepicker({
        minDate: new Date(),
        inline: true,
        onRenderCell: function (date, cellType) {
            if (cellType == 'day') {
                var day = date.getDay(),
                    isDisabled = disabledPartyDays.indexOf(day) != -1;

                return {
                    disabled: isDisabled
                }
            }
        }
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

     $('.datepicker-custom').datepicker({
        minDate: new Date(),
        autoClose: true
    });

    

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
        $('.js-input--tel').mask('+7(000)000-00-00', {clearIfNotMatch: true});
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
            console.log('top: ' + top);
            console.log('topIndent: ' + topIndent);
            $('html').animate({scrollTop: topIndent}, 1000);
        });
    };

    $('.graduation-party-banner__btn').click(function(e){
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


    //поиск по кафе на странице с тортами и в оформлении заказа
    $(document).on('keyup change', '.c-search-page__input', function(){
        checkAll();
    });

    function checkAll() {
        $('.order-delivery-address__list li').each(function(i, item) {
            var value = $(this).find('.order-radio').text().toLowerCase().indexOf($('.c-search-page__input').val().toLowerCase());
            if ( value >= 0 ) {
                $(this).show();
                // $(this).addClass('js-order-delivery-address__show');
            } else {
                $(this).hide();
                // $(this).removeClass('js-order-delivery-address__show');
            }
        });
    }

    checkAll();



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
        $('.js-input--tel').mask('+7(000)000-00-00', {clearIfNotMatch: true});
    });

    /*добавление полей в контактах ЛК*/
    $(document).on('click', '#js-lk-profile__add-info-all', function(e) {
        e.preventDefault();
        console.log('correct');
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__contact-list");
        // $('.js-input--date').mask('+7(000)000-00-00', {clearIfNotMatch: true});

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
        margin:20,
        // items: 4,
        // center: true,
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

    /*кастомный скролл*/
    $('.popup-basket__scroll').jScrollPane();

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
    });;

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
    $('#request-call__tel, #reg__phone').mask('+7(000)000-00-00', {clearIfNotMatch: true});
    $('#request-call__tel, #reg__phone').mask('+7(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--tel').mask('+7(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});
    $('.js-input--loyalty').mask('000-000', {clearIfNotMatch: true});
    $('input[name="form_text_30"]').mask('+7(000)000-00-00', {clearIfNotMatch: true});
    $('input[name="form_text_52"]').mask('+7(000)000-00-00', {clearIfNotMatch: true});

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
    showPopup(".catalog-product .c-card-catalog__img", '.popup-product');
    showPopup(".catalog-product .c-card-catalog__title", '.popup-product');
    showPopup("#loadCake", '.popup-cake-order');
    showPopup(".cake-card__hover", '.popup-cake-order');
    showPopup(".js-easter-btn", '.popup-cake-order');
    showPopup("#lk-profile-subscription-del__ok", '.popup-subscription-del');
    showPopup(".js-party-order", '.popup-party-order');
    showPopup(".c-card-event__link--more", '.popup-event');
    showPopup(".c-card-event__link--basket", '.popup-event-basket');
    showPopup(".c-card-event__link--one-click", '.popup-event-one-click');
    showPopup(".excursion-btn", '.popup-excursion-order');




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


        function hideOutZone(elem, elem2, elem3){
            var div = $(elem);
            var div2 = $(elem2);
            var div3 = $(elem3);
            if (!div.is(e.target)
                && div.has(e.target).length === 0
                && !div2.is(e.target)
                && div2.has(e.target).length === 0
                && !div3.is(e.target)
                && div3.has(e.target).length === 0) {
                // div.removeClass(instrumentHide); // скрываем его
                // console.log('true');
                div.parents('.mfp-wrap').removeClass('is-visible');
                div.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div.parents('html').removeClass('lock-html').css('margin-right','0');

                div2.parents('.mfp-wrap').removeClass('is-visible');
                div2.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div2.parents('html').removeClass('lock-html').css('margin-right','0');

                div3.parents('.mfp-wrap').removeClass('is-visible');
                div3.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div3.parents('html').removeClass('lock-html').css('margin-right','0');
            }
        }
        console.log('mouseup');
        if (e.which === 1) {
            hideOutZone('.popup', '.popup-mini', '.datepicker');
        }


    });


    hidePopup('.popup-basket', 'popup-slide__show');
    hidePopup('.header-mobile__auth', 'popup-slide__show');
    hidePopup('.header-search__form', 'is-visible');
    hidePopup('.header-search-result', 'is-visible');


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
                console.log('click');
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
    $('.icon-basket, .header .symbol-basket, .header-basket__count').on('click', function () {
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
    ShowMobileBtnFilter('.filter-hold-mobile-btn', '.filter-hold');



    /*показ подменю в мобильной версии меню*/
    $('.header-mobile__list .icon-dropdown').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('dropdown-show');
        $('.header-mobile__sublist').slideToggle(200);
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



    /*липкая шапка*/
    $(window).scroll(function(){
        var bo = $(window).scrollTop();
        var $header = $(".header");
        var $logo = $("#symbol-logo");
        var $hederHeight = $header.height();
        if ( bo >= 106 ) {
            $header.addClass('header-top__hide');
            $header.addClass('sticky');
            $logo.addClass('fixed-logo');

            $('main').css({
                'padding-top': $hederHeight
            });
            // $header.addClass('fixed-header');
        } else {
            $header.removeClass('header-top__hide');
            $header.removeClass('sticky');
            $logo.removeClass('fixed-logo');
            // $header.removeClass('fixed-header');
            $('main').css({
                'padding-top': '0'
            });
        }
    });

    /*кастомный селект*/
    $('.c-select').SumoSelect();

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
        $(this).parents('.tabs-menu').parent().siblings('.tab').find(".tab-content").not(tab).css("display", "none");
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
