
//gulp-sass gulp-autoprefixer gulp-plumber gulp-livereload browser-sync gulp-minify-css gulp-clean-css gulp-sourcemaps gulp-concat gulp-concat-css
//plugins for development
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    //minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    browserSync = require('browser-sync').create();


// var srcDir = 'src/';

gulp.task('sass', function(){
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 3 version'))
        // .pipe(sourcemaps.init())
        // .pipe(cleanCSS())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream())
});

gulp.task('js', function(){
    return gulp.src([
        './js/preloader.js',
        './bower_components/jquery/dist/jquery.js',
        './bower_components/tooltipster/dist/js/tooltipster.bundle.js',
        './bower_components/jquery-mask-plugin/dist/jquery.mask.js',
        './js/jscrollpane/jquery.mousewheel.js',
        './js/jscrollpane/jquery.jscrollpane.min.js',
        './js/simplebar.js',
        './js/owlcarousel/owl.carousel.js',
        './bower_components/sumoselect/jquery.sumoselect.js',
        './bower_components/fotorama/fotorama.js',
        './js/tooltip.js',
        './js/instafeed.min.js',
        './js/instagram-script.js',
        './js/custom-map.js',
        './js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('scripts_all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.stream())
});
//
// gulp.task('js', function(){
//     return gulp.src('js/**/*.js')
//         .pipe(gulp.dest('js/'))
//         .pipe(browserSync.stream())
// });

gulp.task('html', function(){
    return gulp.src('**/*.html')
        .pipe(browserSync.stream())
});

gulp.task('css', function(){
    return gulp.src(['./css/simplebar.css', './css/main_global.css', './css/media.css'])
        .pipe(concatCss('main_global_all.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('css/'))
        // .pipe(prefix('last 3 versions'))
        .pipe(browserSync.stream())
});

// gulp.task('css', function(){
//     return gulp.src('css/**/*.css')
//         .pipe(concatCss('main_global_all.min.css'))
//         .pipe(cleanCSS())
//         .pipe(gulp.dest('css/'))
//         .pipe(browserSync.stream())
// });


gulp.task('browser-sync', function(){
    browserSync.init({
        port: 8081,
        server: {
            baseDir: './'
        }
    })
});

gulp.task('connect', function() {
    connect.server({
        root: '',
        livereload: true
    });
});

gulp.task('watch', function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('**/*.html', ['html']);
    gulp.watch('css/**/*.css', ['css']);
});

gulp.task('default', ['html', 'css', 'sass', 'js', 'browser-sync', 'watch']);
