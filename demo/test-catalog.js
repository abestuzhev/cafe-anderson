
$(function(){
    $('.popup-body').on('click', function(e){
        e = e || window.event;
        e.stopPropagation();
        console.log('click popup');
    });
    $('document').on('click', function(e){
        $('.mfp-wrap').removeClass('is-visible');
        $('html').find('.mfp-bg ').removeClass('is-visible');
        $('html').removeClass('lock-html').css('margin-right','0');
        console.log('click document');
    });

    $('.popup-basket__scroll').on( 'mousewheel DOMMouseScroll', function (e) {

        var e0 = e.originalEvent;
        var delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });

});