var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('gulp-merge');

gulp.task('tsc', function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return merge([tsResult.js.pipe(gulp.dest('lib')), tsResult.dts.pipe(gulp.dest('lib/definitions'))]);

});

gulp.task('dev', ['tsc'], function () {
    gulp.watch('./src/**/*.ts', ['tsc']);
})