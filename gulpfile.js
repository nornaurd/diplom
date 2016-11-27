const gulp = require('gulp')
    , sass = require('gulp-sass')
    , csso = require('gulp-csso')
    , gutil = require('gulp-util')
    , clean  = require('gulp-clean')
    , rigger = require('gulp-rigger')
    , concat = require('gulp-concat')
    , notify = require('gulp-notify')
    , rename = require("gulp-rename")
    , uglify = require('gulp-uglify')
    , svgmin = require('gulp-svgmin')
    , connect = require('gulp-connect')
    , sourcemaps = require('gulp-sourcemaps')
    , minifyHTML = require('gulp-minify-html')
    , autoprefixer = require('gulp-autoprefixer')
    , browserSync = require('browser-sync').create()
    , spritesmith = require('gulp.spritesmith')
    ;

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: "7777"
    });

    gulp.watch(['./**/*.html']).on('change', browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
    gulp.watch(['./**/*.css']).on('change', browserSync.reload);

    gulp.watch('./sass/**/*', ['sass']);
});

gulp.task('sass', function () {
    gulp.src(['./sass/**/*.scss', './sass/**/*.sass'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', gutil.log))
        .on('error', notify.onError())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
});

gulp.task('minify-svg', function () {
    return gulp.src('images/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./public/images/'));
});

gulp.task('minify-css', function () {
    gulp.src('./css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 30 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('minify-js', function () {
    gulp.src('./js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('minify-html', function () {
    var opts = {
        conditionals: true,
        spare: true
    };

    return gulp.src(['./**/*.html'])
        .pipe(minifyHTML(opts))
        .pipe(rename({ extname: '.min.html' }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('clean', function() {
    return gulp.src('./public', { read: false }).pipe(clean());
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('images/icons/*.png').pipe(
        spritesmith({
            imgName: 'sprite.png',
            cssName: '_icon-mixin.sass',
            retinaImgName: 'sprite@2x.png',
            retinaSrcFilter: ['images/icons/*@2x.png'],
            cssVarMap: function (sprite) {
                sprite.name = 'icon-' + sprite.name;
            }
        })
    );

    return spriteData.pipe(gulp.dest('sass/'));
});

gulp.task('default', ['server', 'sass']);
gulp.task('production', ['minify-css', 'minify-js', 'minify-svg', 'minify-html']);
