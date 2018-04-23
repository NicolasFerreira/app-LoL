var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var minify      = require('gulp-minify');

// Static Server + watching scss/js/html files
gulp.task('serve', ['sass'] ['minify'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("assets/scss/components/*.scss", ['sass']);
    gulp.watch("assets/scss/layouts/*.scss", ['sass']);
    gulp.watch("assets/scss/*.scss", ['sass']);
    gulp.watch("assets/js/*.js", ['minify']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("assets/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("public/dist/css"))
        .pipe(browserSync.stream());
});

// Compile Js into js.min


gulp.task('minify', function() {
  gulp.src('assets/js/*.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('public/dist/js'))
    .pipe(browserSync.stream())
});



gulp.task('default', ['serve']);