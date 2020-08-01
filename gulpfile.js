
// npm install -D gulp-sass gulp-autoprefixer gulp-livereload gulp-concat browser-sync

//plugins for development
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    browsersync = require('browser-sync').create();


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


gulp.task("watch", function(done) {
    browsersync.init({
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