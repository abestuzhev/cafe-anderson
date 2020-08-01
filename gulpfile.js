
// npm install -D gulp-sass gulp-autoprefixer gulp-livereload gulp-concat browser-sync

//plugins for development
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    browsersync = require('browser-sync').create();



gulp.task('js', function(){
    return gulp.src([
        './js/preloader.js',
        './bower_components/tooltipster/dist/js/tooltipster.bundle.js',
        './bower_components/jquery-mask-plugin/dist/jquery.mask.js',
        './js/jscrollpane/jquery.mousewheel.js',
        './js/jscrollpane/jquery.jscrollpane.min.js',
        './js/simplebar.js',
        './js/owlcarousel/owl.carousel.js',
        './bower_components/sumoselect/jquery.sumoselect.js',
        './bower_components/fotorama/fotorama.js',
        './js/tooltip.js',
        './js/main.js'
    ])
       .pipe(concat('scripts_all.js'))
       .pipe(gulp.dest('./js'))
       .pipe(browsersync.stream());
});

gulp.task('scss', function(){
    return gulp.src("./scss/**/*.scss")
       .pipe(sass())
       .pipe(prefix('last 3 version'))
       .pipe(gulp.dest('./css'))
       .pipe(browsersync.stream());
});


gulp.task('watch', function(){
    browsersync.init({
        port: 8081,
        server: {
            baseDir: "./"
        },
        port: 8081
    })

    gulp.watch("./scss/**/*.scss", gulp.series('scss'));
    gulp.watch("./js/**/*.js", gulp.series('js'));
    gulp.watch('**/*.html').on('change', browsersync.reload);
});


gulp.task('default', gulp.series('scss', 'js', 'watch'));
