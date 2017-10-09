var gulp = require('gulp');

// --------- util --------- //
var del = require("del");
var fs = require("fs");
var minifycss = require('gulp-minify-css');
// --------- /util --------- //

// --------- js concat, uglify  --------- //
var less = require('gulp-less');
var concat = require('gulp-concat');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer'); // 自动添加前缀
// --------- js concat, uglify --------- //

// --------- handle error --------- //
var handleError = function (err) {
	var colors = gutil.colors;
	console.log('\n');
	gutil.log(colors.red('Error!'));
	gutil.log('fileName: ' + colors.red(err.fileName));
	gutil.log('lineNumber: ' + colors.red(err.lineNumber));
	gutil.log('message: ' + err.message);
	gutil.log('plugin: ' + colors.yellow(err.plugin));
}
// --------- /handle error --------- //

var cssDir = "./css/";
var destDir = "./build/";

// --------- tasks --------- //
gulp.task('clean', function () {
	var dirs = [cssDir];

	var dir;
	for (var i = 0; i < dirs.length; i++) {
		dir = dirs[i];
		// make sure the directories exists (they might not in fresh clone)
		if (!fs.existsSync(dir)) {
			fs.mkdir(dir);
		}
		// delete the .css files (this makes sure we do not )
		del.sync(dir + "*.css");
	}

	if(fs.existsSync(destDir)){
		del.sync(destDir + "**");
	}
});

gulp.task('less', function() {
	return gulp.src('./less/**.less')
		.pipe(less())
		.pipe(gulp.dest(cssDir));
});

gulp.task('autoprefixer', ['less'], function () {
	return gulp.src('./css/**.css')
		.pipe(autoprefixer({
			browsers: ['last 4 versions', 'last 2 Chrome versions', 'last 2 Explorer versions', 'last 3 Safari versions', 'Firefox >= 20'],
			cascade: false
		}))
		.pipe(gulp.dest('./css'));
});

gulp.task('minifyCss', ['less', 'autoprefixer'], function () {
	var combined = combiner.obj([
			gulp.src(['./common/css/**.css', './css/**.css'])
			.pipe(concat("bundle.css")),
			sourcemaps.init(),
			minifycss(),
			sourcemaps.write('./'),
			gulp.dest('build/css/'),
		]);
	return combined.on('error', handleError);
});

gulp.task('watch', ['default'], function () {
	gulp.watch(['./less/**.less', './common/less/**.less'], ['minifyCss']);
});

gulp.task('default', ['clean', 'minifyCss']);

gulp.task('build', ['clean','minifyCss']);
// --------- /tasks --------- //
