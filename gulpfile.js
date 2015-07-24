var gulp = require('gulp');
var todo = require('gulp-todo');
var ts = require('gulp-typescript');
var merge = require('merge2');
gulp.task('todo', function() {
	gulp.src(['lib/**/*.ts','test/**/*.js'])
	.pipe(todo({
		verbose:true
	}))
	.pipe(gulp.dest('./'));
});
gulp.task('ts', function () {
	var tsResult = gulp.src('lib/**/*.ts')
		.pipe(ts({
				module:'commonjs',
				target:'ES5',
				removeComments:true,
				declarationFiles:true
			}));
	// return tsResult.js.pipe(gulp.dest('js'));
	return merge([
		tsResult.dts.pipe(gulp.dest('definitions')),
		tsResult.js.pipe(gulp.dest('js'))
	]);
});
gulp.task('ts-example', function () {
	var tsResult = gulp.src('examples-ts/**/*.ts')
		.pipe(ts({
				module:'commonjs',
				removeComments:true,
			}));
	return tsResult.js.pipe(gulp.dest('examples-js'));
});