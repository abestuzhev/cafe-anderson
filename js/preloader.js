document.body.onload = function(){
    setTimeout(function(){
        var preloader = document.getElementById('page-preloader');
        if(!preloader.classList.contains('done')){
            preloader.classList.add('done');
        }
    }, 1000);
};

// функция подключения всех скриптов
function dynamicallyLoadScript() {

    var script,
        // box = document.querySelector('.scripts'),
        src = [
            // 'https://api-maps.yandex.ru/2.1/?lang=ru_RU',
            'https://abestuzhev.github.io/cafe-anderson/js/custom-map.js',
            'https://abestuzhev.github.io/cafe-anderson/bower_components/jquery-mask-plugin/dist/jquery.mask.js',
            'https://abestuzhev.github.io/cafe-anderson/js/jscrollpane/jquery.mousewheel.js',
            'https://abestuzhev.github.io/cafe-anderson/js/jscrollpane/jquery.jscrollpane.min.js',
            'https://abestuzhev.github.io/cafe-anderson/bower_components/tooltipster/dist/js/tooltipster.bundle.js',
            'https://abestuzhev.github.io/cafe-anderson/js/simplebar.js',
            'https://abestuzhev.github.io/cafe-anderson/js/owlcarousel/owl.carousel.js',
            'https://abestuzhev.github.io/cafe-anderson/bower_components/sumoselect/jquery.sumoselect.js',
            'https://abestuzhev.github.io/cafe-anderson/bower_components/fotorama/fotorama.js',
            'https://abestuzhev.github.io/cafe-anderson/js/main.js'
        ];

    for(var i = 0; i < src.length; i++){
        script = document.createElement("script");
        script.src = src[i];
        document.body.appendChild(script);
    }  
};

// document.body.onload = function() {
// };

  dynamicallyLoadScript();
