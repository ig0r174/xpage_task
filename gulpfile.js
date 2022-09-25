const {src, dest, watch, parallel, series} = require('gulp'),
    browserSync = require("browser-sync").create(),
    scss = require('gulp-sass')(require('sass')),
    plumber = require("gulp-plumber"),
    pug = require('gulp-pug'),
    pugLinter = require('gulp-pug-linter'),
    bemValidator = require('gulp-html-bem-validator'),
    concat = require('gulp-concat')
    sourcemaps = require('gulp-sourcemaps');
const gulp = require("gulp");


function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        port: 3030,
        notify: false
    })
}

function css() {
    return src([
            './src/styles/common/reset.scss',
            './src/styles/**/*.scss'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('./build/maps'))
        .pipe(dest('./build/css'))
        .pipe(browserSync.stream())
}

function pug2html(cb) {
    return src('./src/pages/*.pug')
        .pipe(plumber())
        .pipe(pugLinter({reporter: 'default'}))
        .pipe(pug())
        .pipe(bemValidator())
        .pipe(dest('./build'))
        .pipe(browserSync.stream())
}

function copyFonts() {
    return src('./src/fonts/**/*')
        .pipe(dest('./build/fonts'))
}

function copyImages() {
    return src('./src/img/**/*')
        .pipe(dest('./build/img'))
}

function copyJs() {
    return src('./src/js/*')
        .pipe(dest('./build/js'))
}

function watching() {
    watch(['./src/styles/**/*.scss'], css)
    watch(['./src/pages/**/*.pug'], pug2html)
    watch(['./src/img/**/*'], copyImages)
    watch(['./src/js/*'], copyJs)
}

exports.css = css;
exports.pug2html = pug2html;
exports.copyFonts = copyFonts;
exports.copyImages = copyImages;
exports.copyJs = copyJs;
exports.default = parallel(browsersync, watching, pug2html, css, copyFonts, copyImages, copyJs);
