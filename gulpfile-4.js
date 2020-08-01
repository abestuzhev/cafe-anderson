
// npm install -D gulp-sass gulp-autoprefixer gulp-livereload gulp-concat browser-sync

//plugins for development
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();


function sass (){
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 3 version'))
        // .pipe(sourcemaps.init())
        // .pipe(cleanCSS())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream())
};

function js (){
    return gulp.src([
        './js/preloader.js',
        // './bower_components/jquery/dist/jquery.js',
        './bower_components/tooltipster/dist/js/tooltipster.bundle.js',
        './bower_components/jquery-mask-plugin/dist/jquery.mask.js',
        './js/jscrollpane/jquery.mousewheel.js',
        './js/jscrollpane/jquery.jscrollpane.min.js',
        './js/simplebar.js',
        './js/owlcarousel/owl.carousel.js',
        './bower_components/sumoselect/jquery.sumoselect.js',
        './bower_components/fotorama/fotorama.js',
        './js/tooltip.js',
        // './js/datepicker/datepicker.min.js',
        // './js/instafeed.min.js',
        // './js/instagram-script.js',
        // './js/mixitup.min.js',
        // './js/custom-map.js',
        './js/main.js'
    ])
    // .pipe(sourcemaps.init())
        .pipe(concat('scripts_all.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.stream())
};

function html (){
    return gulp.src('**/*.html')
        .pipe(browserSync.stream())
};


function css (){
    return gulp.src([
        'css/**/*.css',
        'constructor/**/*.css'
    ])
        .pipe(prefix('last 3 version'))
        .pipe(browserSync.stream())
};


function head (){
    return gulp.src(['./demo-head/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 3 version'))
        .pipe(gulp.dest('demo-head/'))
        .pipe(browserSync.stream())
};


function browsersync(){
    browserSync.init({
        port: 8081,
        server: {
            baseDir: './'
        }
    })
};

function connect () {
    connect.server({
        root: '',
        livereload: true
    });
};

function watch () {
    gulp.watch('scss/**/*.scss', sass);
    gulp.watch('demo-head/**/*.scss', head);
    gulp.watch('js/**/*.js', js);
    gulp.watch('**/*.html', html);
    gulp.watch('**/*.css', css);
};

// gulp.task('default', ['html', 'css', 'sass', 'js', 'head', 'browser-sync', 'watch']);
exports.default = gulp.series(
    gulp.parallel( html, css, sass, js, head, browsersync), 
    watch
  );