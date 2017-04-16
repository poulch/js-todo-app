var gulp = require('gulp'),
    sass = require('gulp-sass'),
    surcemap = require('gulp-sourcemaps');


var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed'
};


gulp.task('sass', function(){
  return gulp.src('sass/main.scss')
  .pipe(surcemap.init())
  .pipe(sass(sassOptions).on('error', sass.logError))
  .pipe(surcemap.write())
  .pipe(gulp.dest('css/'));
});




gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sass']);

});

gulp.task('build', ['sass']);

gulp.task('default', function(){
  gulp.watch('sass/**/*.scss', ['sass']);
});