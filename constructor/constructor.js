$(function(){
'use strict';
    var CakeConstructor = function(constructor) {
        this.constructor = constructor;
        this.elementShape = document.getElementById('cake_shape');
        this.itemsShape = this.elementShape.getElementsByClassName('constructor-product-shape__item');
        this.classNamesShape = ['selected', 'behind'];
        this.selectedShape = 'round';/*форма*/
        this.selectedTier = 'one';/*количество ярусов*/

        if (this.itemsShape.length !== 2) {
            alert('В списке больше 2-х ярусов!');
            return false;
        } else {
            for (var i = 0; i < 2; i++) {
                this.itemsShape[i].className += " " + this.classNamesShape[i];
            }

        }

    };

    CakeConstructor.prototype = {
        prev: function() {
            var l = this.elementShape.getElementsByClassName('behind')[0],
                c = this.elementShape.getElementsByClassName('selected')[0];
            l.classList.remove('behind');
            l.classList.add('selected');
            c.classList.remove('selected');
            c.classList.add('behind');
        },
        next: function() {
            var l = this.elementShape.getElementsByClassName('behind')[0],
                c = this.elementShape.getElementsByClassName('selected')[0];
            l.classList.remove('behind');
            l.classList.add('selected');
            c.classList.remove('selected');
            c.classList.add('behind');
        },


        bindEvents: function(){
            var self = this;

        }

    };

    // var carousel = new CakeShape('cake_shape', 'constructor-product-shape__item');
    var carousel = new CakeConstructor('.constructor');
    $(document).on('click', '.constructor-product-shape__item.behind', function(e){
        e.preventDefault();

        if($(this).data('tier') == 'two'){
            carousel.next();
            // var dataShape = $('.constructor-product-shape__item.selected').data('shape');
            // var dataTier = $('.constructor-product-shape__item.selected').data('tier');
            // carousel.selectedShape = dataShape;
            // carousel.selectedTier = dataTier;
        }else{
            carousel.prev();
        }

    });

    // console.log('carousel.selectedShape ' + carousel.selectedShape);
    // console.log('carousel.selectedTier ' + carousel.selectedTier);

});
/*конец обертки*/

