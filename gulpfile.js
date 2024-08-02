const { src, dest, watch, parallel } = require("gulp");
// css
const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
//identificar la linea de css
const sourcemaps = require('gulp-sourcemaps');



//imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//javascript
const terser = require('gulp-terser-js');

function css(done) {

    src('src/scss/**/*.scss')//identificar el archivo de SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())//compilarla
        .pipe(postcss([autoprefixer(), cssnano()]))//
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css"))//almacenar en el disco duro

    done(); //callback que avisa a gulp cuando llegamos al final
}
function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();

}


function versionWebp(done) {
    const opciones = {

        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done(); //callback que avisa a gulp cuando
}

function versionAvif(done) {
    const opciones = {

        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))

    done(); //callback que avisa a gulp cuando
}

function javascript(done) {
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe( terser() )
.pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}


function dev(done) {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', javascript)

    done(); //callback
}
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);