var gulp = require('gulp')
  , coffee = require('gulp-coffee')
  , ngAnnotate = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , concat = require('gulp-concat')

var files = [
  "src/index.coffee"
]

gulp.task('build', function() {
  return gulp.src(files)
         .pipe(coffee())
         .pipe(concat('dist/index.js'))
         .pipe(gulp.dest('.'))
})

gulp.task('minified', function() {
  return gulp.src(files)
         .pipe(coffee())
         .pipe(uglify())
         .pipe(ngAnnotate())
         .pipe(concat('dist/index.min.js'))
         .pipe(gulp.dest('.'))
})

gulp.task('default', ['build', 'minified'])

gulp.task('watch', ['default'], function() {
  gulp.watch(files, ['default'])
})
