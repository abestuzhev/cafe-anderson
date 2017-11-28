// document.body.onload = function(){
//     setTimeout(function(){
//         var preloader = document.getElementById('page-preloader');
//         if(!preloader.classList.contains('done')){
//             preloader.classList.add('done');
//         }
//     }, 1000);
// };

document.body.onload = function(){

    // setTimeout(function(){
    //     var preloader = document.querySelectorAll('body');
        if(!document.body.classList.contains('done')){
            document.body.classList.add('done');
        }
    // }, 500);
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
