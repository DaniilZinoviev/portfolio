var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cssmin = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cache = require('gulp-cache'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/',
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*',
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*',
	},
	clean: './dist',
};

var config = {
	server: {
		baseDir: 'dist',
	},
	notify: false,
};

// tasks
gulp.task('html:build', async function() {
	gulp.src(path.src.html) // Get files by desired path
		.pipe(rigger()) // Throw though rigger
		.pipe(gulp.dest(path.build.html)) // Place in dist folder
		.pipe(reload({stream: true})); // reload our server for updates
});

gulp.task('js:build', async function() {
	gulp.src(path.src.js)
			.pipe(rigger())
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(path.build.js))
			.pipe(reload({stream: true}));
});

gulp.task('style:build', async function() {
	gulp.src(path.src.style)
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(prefixer())
			.pipe(cssmin())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(path.build.css))
			.pipe(reload({stream: true}));
});

gulp.task('image:build', async function() {
	gulp.src(path.src.img)
			.pipe(cache(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()],
				interlaced: true
			})))
			.pipe(gulp.dest(path.build.img))
			.pipe(reload({stream: true}))
});

gulp.task('fonts:build', async function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});

gulp.task('favicon:build', async function() {
	gulp.src('src/favicon.(svg|ico)')
		.pipe(gulp.dest(path.build.html));
});

gulp.task('cv:build', async function() {
	gulp.src('src/cv.(pdf|txt)')
		.pipe(gulp.dest(path.build.html));
});

gulp.task('browser-sync', function() {
	browserSync(config);
});

gulp.task('clean', function(cb) {
	cache.clearAll();
	rimraf(path.clean, cb);
});

// Compile all of tasks
gulp.task('build', gulp.parallel(
	'fonts:build',
	'image:build',
	'style:build',
	'js:build',
    'html:build',
    'favicon:build',
    'cv:build'
));

gulp.task('watch', function() {
	gulp.watch(path.watch.html, gulp.parallel('html:build'));
	gulp.watch(path.watch.style, gulp.parallel('style:build'));
	gulp.watch(path.watch.js, gulp.parallel('js:build'));
	gulp.watch(path.watch.img, gulp.parallel('image:build'));
	gulp.watch(path.watch.fonts, gulp.parallel('fonts:build'));
});

// To use
gulp.task('default', gulp.parallel('build', 'browser-sync', 'watch'));