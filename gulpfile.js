const gulp = require('gulp');

const browserSync = require('browser-sync').create();

const scss = require('gulp-sass');

const autoprefixer = require('gulp-autoprefixer');

const concatCss = require('gulp-concat-css');

const cleanCSS = require('gulp-clean-css');

const rename = require('gulp-rename');

const uglify = require('gulp-uglify');

const notify = require('gulp-notify');

const svgstore = require('gulp-svgstore');

const svgmin = require('gulp-svgmin');

const path = require('path');


gulp.task('serve', ['scss'], () => {
  browserSync.init({

    server: 'src/',

  });

  gulp.watch('src/scss/*.scss', ['scss']);

  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('scss', () => gulp.src('src/scss/*.scss')

  .pipe(scss().on('error', notify.onError(
    {
      message: '<%= error.message %>',
      title: 'Sass Error!',
    },
  )))

  .pipe(autoprefixer({

    browsers: ['last 2 versions'],

    cascade: false,

  }))

  .pipe(concatCss('style.css'))

  .pipe(gulp.dest('src/css'))

  .pipe(browserSync.stream()));

gulp.task('mincss', () => gulp.src('src/css/*.css')

  .pipe(rename({ suffix: '.min' }))

  .pipe(cleanCSS())

  .pipe(gulp.dest('app/css')));

gulp.task('minjs', () => gulp.src('src/js/*.js')

  .pipe(rename({ suffix: '.min' }))

  .pipe(uglify())

  .pipe(gulp.dest('app/js')));

gulp.task('min', ['mincss', 'minjs']);

gulp.task('default', ['serve']);

gulp.task('svgstore', () => gulp
  .src('src/img/svg/*.svg')
  .pipe(svgmin((file) => {
    const prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: `${prefix}-`,
          minify: true,
        },
      }],
    };
  }))
  .pipe(svgstore())
  .pipe(gulp.dest('src/img/svg')));
