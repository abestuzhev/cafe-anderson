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

// var containerEl = document.querySelector('.mixed-list');
// var mixer = mixitup(containerEl);

$(document).ready(function ($) {
    //------------------------------------------------------------custom
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


    /*показываем маленький блок с выбранными товарами в карточке товара (мобильная версия)*/
    $('.popup-product__check-mobile').on('click', function(e){
        e.preventDefault();
        $('.popup-product .popup-mini').addClass('active');
    });
    /*закрываем маленький попап с товарами*/
    $('.popup-product__check-close').on('click', function(e){
        e.preventDefault();
        $('.popup-product .popup-mini').removeClass('active');
    });

    $('.popup-mini').on('click', function(e){
        e.preventDefault();

    });

    /*показываем категории меню в каталоге*/
    $('.filter-bage').on('click', function(e){
        e.preventDefault();
        $('.catalog-body').toggleClass('show-category');
    });
    $('.filter-hold__close').on('click', function(e){
        e.preventDefault();
        $('.catalog-body').removeClass('show-category');
    });

    var windowWidth = $(window).width();


    $(window).on('resize', function () {
    	if(windowWidth <= 730){
    	    $('.filter-hold__close').on('click', function(e){
                e.preventDefault();
                console.log('close');
    	        $(this).parents('.filter-hold').slideUp(300);
            });
        }
    });

    if(windowWidth <= 730){
        $('.filter-hold__close').on('click', function(e){
            e.preventDefault();
            console.log('close');
            $(this).parents('.filter-hold').slideUp(300);
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
            600:{
                nav: true,
                items:5
            },
            1200:{
                nav: true,
                items:6
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
    $(window).on('resize', fix_size);
    fix_size();


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

    /*Фоторама, слайдер мероприятий, слайдер отзывов*/
    var $slider = $('.cafe-fotorama').fotorama({
        width: '100%',
        // maxwidth: '100%',
        ratio: 17/11,
        loop: true,
        thumbwidth: 88,
        allowfullscreen: true,
        nav: 'thumbs',
        fit:'cover'
    });

    $slider
        .on('fotorama:show', function (e, fotorama) {
            // pick the active thumb by id
            var path = fotorama.activeFrame.img;
            $('.bg-blur').attr('src', path);
        });


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
    $('#request-call__tel, #reg__phone').mask('+7(000)000-00-00');
    $('.js-input--tel').mask('+7(000)000-00-00');

    /*показ номера телефона в карточке кафе*/
    $('.cafe-info__item-col .c-button').on('click', function(e){
        e.preventDefault();
        $(this).hide();
        $(this).parents('.l-button').siblings('.cafe-info__phone-number').show();
    });

    /*функция показа модального окна*/
    function showPopup(icon, popup) {
        $(icon).on('click', function (e) {
            e.preventDefault();
            $(popup).addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');


            $('html').css({
                // 'overflow':'hidden'
                // 'margin-right':'17px'
            }).addClass('lock-html');
            $('.c-layout').addClass('popup-fix');
            $('.header.sticky').css({
                // 'right':'17px'
            });


            // $('html').addClass('body-popup');
        });
    }

    $(".popup-close, .js-popup-close").click(function (e) {
        e.preventDefault();
        $(this).parents('.mfp-wrap').removeClass('is-visible');
        $('.mfp-bg').removeClass('is-visible');
        $('html').css({
            // 'overflow':'auto'
            // 'margin-right':'0'
        }).removeClass('lock-html');
        $('.c-layout').removeClass('popup-fix');
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
    showPopup(".c-reviews-positive", '.popup__review');
    showPopup(".c-reviews-negative", '.popup__review');
    showPopup(".footer-reviews__icon", '.popup__review');
    showPopup(".popup-forgot-password", '.popup__recovery-password');
    showPopup(".c-card-catalog__img", '.popup-product');
    showPopup(".c-card-catalog__title", '.popup-product');



    $('.popup-forgot-password').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-authorization').removeClass('is-visible');
        $('.popup__recovery-password').addClass('is-visible');
    });


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
        $(this).parents('.header-mobile__auth').removeClass('.popup-slide__show');
    });

    $("#mobile-auth").click(function (e) {
        e.preventDefault();
        $('.popup').removeClass('is-visible');
        $('.popup-authorization').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $(this).parents('.header-mobile__auth').removeClass('.popup-slide__show');
    });

    /*поиск в шапке*/
    $(".header-search .icon-search").click(function (e) {
        e.preventDefault();
        $('.header-search__form').toggleClass('is-visible');
        $('.header-search-result').toggleClass('is-visible');
    });

    /*показ мобильного поиска*/
    $(".header-mobile__search .icon-search").click(function (e) {
        e.preventDefault();
        $('.header-mobile__search-box').show();
        $('.header-mobile__menu').hide();
        $('.header-mobile__search .icon-search').hide();
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

    /*скрываем попапы вне зоны элемента*/

    $(document).mouseup(function (e) { // событие клика по веб-документу
        var div = $('.popup'); // тут указываем ID элемента
        // var div2 = $('.popup-mini');

        function hideOutZone(elem, elem2){
            var div = $(elem);
            var div2 = $(elem2);
            if (!div.is(e.target) // если клик был не по нашему блоку
                && div.has(e.target).length === 0
                && !div2.is(e.target) // если клик был не по нашему блоку
                && div2.has(e.target).length === 0) { // и не по его дочерним элементам
                // div.removeClass(instrumentHide); // скрываем его
                console.log('прошел');
                div.parents('.mfp-wrap').removeClass('is-visible');
                div2.parents('.mfp-wrap').removeClass('is-visible');
                $('.mfp-bg ').removeClass('is-visible');
                $('html').css({
                    // 'overflow':'auto',
                    // 'margin-right': '0'
                });
            }
        }
        hideOutZone('.popup', '.popup-mini');

    });







    hidePopup('.popup-basket', 'popup-slide__show');
    hidePopup('.header-mobile__auth', 'popup-slide__show');
    hidePopup('.header-search__form', 'is-visible');
    hidePopup('.header-search-result', 'is-visible');


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
            }else {
                $(btn_form).attr('disabled', 'disabled');
            }
        });
    }

    DisabledFormButton('#popup-reg','#reg__regulations','#popup-reg button');
    DisabledFormButton('#popup__write-to-us','#write-to-us__regulations','#popup__write-to-us button');
    DisabledFormButton('#popup__request-call','#request-call__regulations','#popup__request-call button');
    DisabledFormButton('#popup__vacancy','#vacancy__regulations','#popup__vacancy button');



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
    $('.icon-basket, .header-basket__count').on('click', function () {
        $('.popup-basket').addClass('popup-slide__show');
        $('.header').addClass('header-top__no-hide');
    });

    $('.popup-basket__close').on('click', function () {
        $('.popup-basket').removeClass('popup-slide__show');
        $('.header').removeClass('header-top__no-hide');
    });


    /*проверяет в фильтре наличие селекта и еслит есть делает родитель блочным для отображения в мобильной версии*/
    $('.filter').each(function(){
        var $filterBody =  $('.filter-item__body');
        $filterBody.has('select').css('display', 'block');
        $filterBody.has('select').parents('.filter-item').css('border','none')
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
        if ( bo > 250 ) {
            $header.addClass('header-top__hide');
            $header.addClass('sticky');
        } else {
            $header.removeClass('header-top__hide');
            $header.removeClass('sticky');
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

    changeRabbitFace('#form_dropdown_SIMPLE_QUESTION_868');
    // changeRabbitFace('#form_dropdown_SIMPLE_QUESTION_867');






    /*простые табы*/
    $(".cafe-list-layout .tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });

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
