
const $btn = document.querySelector('.js-show-popup-child-holidays');

$btn.addEventListener("click", function(e){
   e.preventDefault();
});
const slider = document.querySelector('.e-calendar-layout');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
   isDown = true;
   slider.classList.add('active');
   startX = e.pageX - slider.offsetLeft;
   scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
   isDown = false;
   slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
   isDown = false;
   slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
   if(!isDown) return;
   e.preventDefault();
   const x = e.pageX - slider.offsetLeft;
   const walk = (x - startX) * 3; //scroll-fast
   slider.scrollLeft = scrollLeft - walk;
});

$(document).ready(function () {



   //owl-navigator

   // $('.owl-navigator').owlCarousel({
   //    // center: true,
   //    items:12,
   //    margin:10,
   //    nav: true,
   //    startPosition: 9,
   //    responsive:{
   //       1200:{
   //          items:12
   //       },
   //       800:{
   //          items:9,
   //          margin:0
   //       },
   //       700:{
   //          items:6,
   //          margin:0
   //       },
   //       450:{
   //          items:3,
   //          margin:0,
   //          startPosition: 6
   //       },
   //       0:{
   //          items:3,
   //          margin:0
   //       }
   //    }
   // });



   let windowWidth = $(window).width();

   if(windowWidth < '1200'){
      initSlider();
   }



   function initSlider(){
      $('.e-calendar-navigator__layout-month').slick({
         centerMode: true,
         infinite: false,
         slidesToShow: 12,
         prevArrow: '<a href="#" class="e-calendar-navigator__left">\n' +
            '                     <svg class="c-symbol symbol-arr-left"><use xlink:href="#symbol-arr-left" /></svg>\n' +
            '                  </a>',
         nextArrow: '<a href="#" class="e-calendar-navigator__right">\n' +
            '                     <svg class="c-symbol symbol-arr-right"><use xlink:href="#symbol-arr-right" /></svg>\n' +
            '                  </a>',
         variableWidth: true,
         responsive: [
            {
               breakpoint: 1200,
               settings: {
                  arrows: true,
                  centerMode: false,
                  slidesToScroll: 3,
                  centerPadding: '40px',
                  slidesToShow: 9
               }
            },
            {
               breakpoint: 1000,
               settings: {
                  arrows: true,
                  centerMode: true,
                  slidesToScroll: 3,
                  slidesToShow: 6
               }
            },
            {
               breakpoint: 600,
               settings: {
                  arrows: false,
                  centerMode: true,
                  slidesToShow: 4
               }
            },
            {
               breakpoint: 450,
               settings: {
                  arrows: true,
                  centerMode: false,
                  centerPadding: '40px',
                  slidesToShow: 3
               }
            }
         ]
      });
   }


});