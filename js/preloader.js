// document.body.onload = function(){
//     setTimeout(function(){
//         var preloader = document.getElementById('page-preloader');
//         if(!preloader.classList.contains('done')){
//             preloader.classList.add('done');
//         }
//     }, 1000);
// };

/*новый прелоудер*/
document.body.onload = function(){

    if(document.body.classList.contains('is-content-hidden')){
        document.body.classList.add('visible');
    }

    document.body.classList.add('onloadContent');

    // var holidays = document.querySelectorAll('.holidays-grid');
    // holidays.classList.add('no-content')

};



// функция подключения всех скриптов
// function dynamicallyLoadScript() {

//     var script,
//         listScripts = document.getElementById('listScripts'),
//         src = [
//             // 'https://api-maps.yandex.ru/2.1/?lang=ru_RU',
//             './js/custom-map.js',
//             './bower_components/jquery-mask-plugin/dist/jquery.mask.js',
//             './js/jscrollpane/jquery.mousewheel.js',
//             './js/jscrollpane/jquery.jscrollpane.min.js',
//             // 'https://abestuzhev.github.io/cafe-anderson/bower_components/tooltipster/dist/js/tooltipster.bundle.js',
//             './js/simplebar.js',
//             './js/owlcarousel/owl.carousel.js',
//             './bower_components/sumoselect/jquery.sumoselect.js',
//             './bower_components/fotorama/fotorama.js'
//         ];

//     for(var i = 0; i < src.length; i++){
//         script = document.createElement("script");
//         script.src = src[i];
//         listScripts.appendChild(script);
//     }  
// };

//   dynamicallyLoadScript();
