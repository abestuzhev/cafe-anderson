
// npm install -D gulp-sass gulp-autoprefixer gulp-livereload gulp-concat browser-sync

//plugins for development
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    browsersync = require('browser-sync').create();


<<<<<<< HEAD
// function sass (done){
//     return gulp.src('./scss/**/*.scss')
//         .pipe(prefix('last 3 version'))
//         .pipe(gulp.dest('./css/'))
//         .pipe(browsersync.stream());
//     done();
// };

// function scss (done){
//     return gulp.src('**/*.scss')
//        .pipe(gulp.dest('./css/'))
//        .pipe(browsersync.stream());
//     done();
// }
//
// function js (done){
//     return gulp.src([
//         './js/preloader.js',
//         // './bower_components/jquery/dist/jquery.js',
//         './bower_components/tooltipster/dist/js/tooltipster.bundle.js',
//         './bower_components/jquery-mask-plugin/dist/jquery.mask.js',
//         './js/jscrollpane/jquery.mousewheel.js',
//         './js/jscrollpane/jquery.jscrollpane.min.js',
//         './js/simplebar.js',
//         './js/owlcarousel/owl.carousel.js',
//         './bower_components/sumoselect/jquery.sumoselect.js',
//         './bower_components/fotorama/fotorama.js',
//         './js/tooltip.js',
//         // './js/datepicker/datepicker.min.js',
//         // './js/instafeed.min.js',
//         // './js/instagram-script.js',
//         // './js/mixitup.min.js',
//         // './js/custom-map.js',
//         './js/main.js'
//     ])
//     // .pipe(sourcemaps.init())
//         .pipe(concat('scripts_all.js'))
//         // .pipe(sourcemaps.write())
//         .pipe(gulp.dest('./js/'))
//         .pipe(browsersync.stream());
//     done();
// };
//
// function html (done){
//     return gulp.src('**/*.html')
//         .pipe(browsersync.stream());
//     done();
// };
//
//
// function css (done){
//     return gulp.src([
//         './css/**/*.css',
//         './constructor/**/*.css'
//     ])
//         .pipe(prefix('last 3 version'))
//         .pipe(browsersync.stream());
//     done();
// };
//
//
// function browserSync(done) {
//     browsersync.init({
//         server: {
//             baseDir: "./"
//         },
//         port: 8081
//     });
//     // browsersync.watch('./').on('change', browsersync.reload);
//     done();
// }
//
// function watch () {
//     gulp.watch('**/*.scss', gulp.series('scss').on('change', browsersync.reload));
//     gulp.watch('./js/**/*.js',  gulp.series('js').on('change', browsersync.reload));
//     gulp.watch('**/*.html',  gulp.series('html').on('change', browsersync.reload));
//     gulp.watch('**/*.css',  gulp.series('css').on('change', browsersync.reload));
//
// };

=======
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

>>>>>>> ffdfd45f47e1a0dbbd8cbb187d8a4d35a39b194c
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
<<<<<<< HEAD
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


gulp.task("watch", function(done) {
    browsersync.init({
=======
    // .pipe(sourcemaps.init())
        .pipe(concat('scripts_all.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.stream())
});
//
// gulp.task('jsMain', function(){
//     return gulp.src([
//         './js/main.js'
//     ])
//     //
//         .pipe(concat('main.min.js'))
//         .pipe(gulp.dest('js/'))
//         .pipe(browserSync.stream())
// });
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

// gulp.task('css', function(){
//     return gulp.src(['./css/simplebar.css', './css/main_global.css', './css/media.css'])
//         .pipe(concatCss('main_global_all.min.css'))
//         .pipe(cleanCSS())
//         .pipe(gulp.dest('css/'))
//         // .pipe(prefix('last 3 versions'))
//         .pipe(browserSync.stream())
// });

gulp.task('css', function(){
    return gulp.src([
        'css/**/*.css',
        'constructor/**/*.css'
    ])
        .pipe(prefix('last 3 version'))
        .pipe(browserSync.stream())
});

// gulp.task('cssConf', function(){
//     return gulp.src('js/**/*.css')
//         .pipe(browserSync.stream())
// });

gulp.task('head', function(){
    return gulp.src(['./demo-head/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 3 version'))
        .pipe(gulp.dest('demo-head/'))
        .pipe(browserSync.stream())
});


gulp.task('browser-sync', function(){
    browserSync.init({
        port: 8081,
>>>>>>> ffdfd45f47e1a0dbbd8cbb187d8a4d35a39b194c
        server: {
            baseDir: "./"
        },
        port: 8081
    })
<<<<<<< HEAD

    gulp.watch("./scss/**/*.scss", gulp.series('scss'));
    gulp.watch("./js/**/*.js", gulp.series('js'));
    gulp.watch('**/*.html').on('change', browsersync.reload);
});


gulp.task('default', gulp.series('scss', 'js', 'watch'));
=======
});

gulp.task('connect', function() {
    connect.server({
        root: '',
        livereload: true
    });
});

gulp.task('watch', function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('demo-head/**/*.scss', ['head']);
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('**/*.html', ['html']);
    // gulp.watch('home.html', ['critical']);
    gulp.watch('**/*.css', ['css']);
});

gulp.task('default', ['html', 'css', 'sass', 'js', 'head', 'browser-sync', 'watch']);
>>>>>>> ffdfd45f47e1a0dbbd8cbb187d8a4d35a39b194c
