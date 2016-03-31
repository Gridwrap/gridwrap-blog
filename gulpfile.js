var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    cp          = require('child_process'),
    changed     = require('gulp-changed'),

    // sass
    sass      = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');
    sourcemaps   = require('gulp-sourcemaps');

    // images
    imagemin    = require('gulp-imagemin');

var messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--drafts', '--quiet', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'}).on('close', done);
    // return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browserSync', ['jekyll-build'], function() {
    browserSync({
        server: { baseDir: "_site/" },
        open: false
    });
});

gulp.task('styles', function() {
    return gulp.src('src/styles/main.scss')
        .pipe(changed('assets/styles'))
        .pipe(sourcemaps.init())
        .pipe(sass({imagePath: '/assets/images'}))
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('_site/assets/styles'))
        .pipe(gulp.dest('_includes'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('assets/styles'));
});

gulp.task('imagemin', function(tmp) {
    return gulp.src('assets/images/**/*.{jpg,png,gif}')
        .pipe(changed('assets/images'))
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('assets/images'));
});

gulp.task('watch', function() {
    gulp.watch('src/styles/**/*', ['styles']);
    gulp.watch('src/images/**/*.{jpg,png,gif}', ['imagemin']);
    gulp.watch(['_drafts/*', '_includes/*', '_layouts/*', '_posts/*', '*.{html,md}', '_config.yml'], ['jekyll-rebuild']);
});

gulp.task('default', ['styles', 'imagemin', 'browserSync', 'watch']);
