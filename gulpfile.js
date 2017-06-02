var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('gulp-merge');
var uglify = require('gulp-uglify');
var del = require('del');


gulp.task('tsc', function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return merge([tsResult.js.pipe(gulp.dest('lib')), tsResult.dts.pipe(gulp.dest('lib/definitions'))]);

});

gulp.task('dev', ['tsc'], function () {
    gulp.watch('./src/**/*.ts', ['tsc']);
})

gulp.task('npm.deploy:clean', [], function (done) {
    del([
        '../deploy/jdash-mysqldb/lib/**/*'
    ], {
            force: true
        }).then(() => done()).catch(err => done(err))
});

gulp.task('npm.deploy', ['npm.deploy:clean'], function () {
    return gulp.src(['lib/**/*.js'])
        .pipe(uglify({

        }))
        .pipe(gulp.dest('../deploy/jdash-mysqldb/lib'))
})
