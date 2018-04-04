function flyToElement(flyer, flyingTo) {
    var $func = $(this),
        divider = 9,
        flyerClone = $(flyer).clone();

    // console.log($func);
    $(flyerClone).css({
        position:'absolute',
        top: $(flyer).offset().top + 'px',
        left: $(flyer).offset().left + 'px',
        opacity: 1,
        'z-index': 1020
    });
    $('body').append($(flyerClone));
    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() /divider) / 2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() /divider) / 2;

    $(flyerClone).animate({
        opacity: 0.4,
        left: gotoX,
        top: gotoY,
        width:  $(flyer).width()/divider,
        height:  $(flyer).height()/divider
    }, 700,

    function(){
        $(flyingTo).fadeOut('fast', function(){
            $(flyingTo).fadeIn('fast', function(){
                $(flyerClone).fadeOut('fast', function(){
                    $(flyerClone).remove();
                })
            })
        })
    })
}

$(function(){
    $(document).on('click', '.c-card-catalog__basket', function(e){
        e.preventDefault();
        // var itemCard = $(this).parents('.c-card-catalog'),
        var itemCard = $(this).parents('.c-card-catalog').find('.c-card-catalog__img img'),
            basketIcon = $('.header-basket');
        flyToElement(itemCard, basketIcon);
    });
});