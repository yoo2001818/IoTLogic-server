var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var webpack = require('webpack');
var markdown = require('gulp-markdown');
var wrapper = require('gulp-wrapper');
var webpackConfiguration = require('./webpack.config.js');
var del = require('del');
var fs = require('fs');
require('babel-core/register');

/*** Manual ***/
gulp.task('doc-md', function () {
  return gulp.src(['doc/**/*.md'])
  .pipe(markdown())
  .pipe(wrapper({
    header: fs.readFileSync('./doc/header.html', 'utf-8'),
    footer: fs.readFileSync('./doc/footer.html', 'utf-8')
  }))
  .pipe(gulp.dest('doc-dist'));
});

gulp.task('doc-copy', function() {
  return gulp.src(['doc/**/*', '!doc/**/*.md'])
    .pipe(gulp.dest('doc-dist'));
});

gulp.task('doc', ['doc-md', 'doc-copy']);


/*** Unit tests ***/
gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('mocha', function() {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', gutil.log);
});

gulp.task('mochaMin', function() {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'min' }))
    .on('error', gutil.log);
});

gulp.task('test', ['lint', 'mocha']);

/*** Frontend ***/
gulp.task('webpack', function(callback) {
  // run webpack
  webpack(webpackConfiguration, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));
    callback();
  });
});

gulp.task('client', ['webpack']);

/*** Backend ***/
gulp.task('babel', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('copy', function() {
  return gulp.src(['src/**/*', '!src/**/*.js'])
    .pipe(gulp.dest('lib'));
});

gulp.task('server', ['babel', 'copy']);

/*** Wrap up ***/

gulp.task('watch', function() {
  gulp.watch(['src/**', 'test/**'], ['mochaMin']);
});

gulp.task('clean', function() {
  return del([
    'dist/**/*',
    'lib/**/*'
  ]);
});

gulp.task('default', ['test', 'client', 'server']);
