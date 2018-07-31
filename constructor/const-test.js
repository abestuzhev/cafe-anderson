// $(function(){

var CakeShape = function(el, classname) {
    var element = document.getElementById(el);
    var items = element.getElementsByClassName(classname);
    var classNames = ['selected', 'behind'];
    var selected = false;
    if (items.length !== 2) {
        alert('В списке больше 2-х ярусов!');
        return false;
    } else {
        for (var i = 0; i < 2; i++) {
            items[i].className += " " + classNames[i];
        }

    }

    var obj = {
        element: element,
        items: items,
        prev: function() {
            var l = this.element.getElementsByClassName('behind')[0],
                c = this.element.getElementsByClassName('selected')[0];
            l.classList.remove('behind');
            l.classList.add('selected');
            c.classList.remove('selected');
            c.classList.add('behind');
        },
        next: function() {
            var l = this.element.getElementsByClassName('behind')[0],
                c = this.element.getElementsByClassName('selected')[0];
            l.classList.remove('behind');
            l.classList.add('selected');
            c.classList.remove('selected');
            c.classList.add('behind');
        }
    };
    return obj;
};


var carousel = new CakeShape('cake_shape', 'constructor-product-shape__item');

// console.log(carousel.showSelect());

// var auto = setInterval(function() { carousel.next(); }, 2000);

// var selected = document.querySelectorAll('.constructor-product-shape__item.behind');

// selected.onclick = carousel.prev.bind(carousel);
// selected.onclick = console.log('click');
var next = document.getElementById('next');
next.onclick = carousel.next.bind(carousel);

// $('#next').on('click', function(e){
//     e.preventDefault();
//     // carousel.next();
//     console.log('next')
// })
//
// $('#prev').on('click', function(e){
//     e.preventDefault();
//     // carousel.prev();
//     console.log('prev');
// })

var prev = document.getElementById('prev');
prev.onclick = carousel.prev.bind(carousel);


// });
/*конец обертки*/

