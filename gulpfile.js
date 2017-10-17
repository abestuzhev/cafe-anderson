
//gulp-sass gulp-autoprefixer gulp-plumber gulp-livereload browser-sync gulp-minify-css
//plugins for development
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync').create();


// var srcDir = 'src/';

gulp.task('sass', function(){
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 2 version'))
        .pipe(gulp.dest('css/'))
        .pipe(minifyCSS())
        .pipe(browserSync.stream())
});

gulp.task('js', function(){
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.stream())
});

gulp.task('html', function(){
    return gulp.src('**/*.html')
        .pipe(browserSync.stream())
});

gulp.task('css', function(){
    return gulp.src('css/**/*.css')
        .pipe(browserSync.stream())
});


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
