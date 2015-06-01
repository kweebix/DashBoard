var gulp  = require('gulp');
var browserify = require('gulp-browserify');

gulp.task("browserify", function(){
  gulp.src('app.js')
    .pipe(browserify())
    .pipe(gulp.dest('static/js'));
})


gulp.task('default', ['browserify'], function(){
  gulp.watch(['app.js', '**/*.js', '!static/js/app.js'], ['browserify']);
})

