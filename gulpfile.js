const { series, src, dest, watch, parallel } = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');

/**
 * @description 删除dist文件夹
 * @param {function} done
 */
function cleanTask(done) {
  del.sync('dist')
    done()
}

/**
 * @description 起服务
 */
function serverTask() {
  connect.server({
    root: './dist',
    port: 8888,
    livereload: true,
    middleware: function(connect, opt) {
        return [
            proxy('/api/',  {
                target: 'https://devtk.aibeike.com',
                changeOrigin:true,
                pathRewrite: {  // 覆写路径
                  '^/api/': ''
                }
            })
        ]
    }
  })
}

/**
 * @description 处理html任务
 * @returns
 */
function htmlTask() {
  return src('src/index.html')
          .pipe(dest('dist'))
          .pipe(connect.reload()) // 热加载
}

/**
 * @description 处理js任务
 * @returns
 */
function jsTask() {
  // 读取src文件夹下所有js文件
  return src('src/**/*.js')
          .pipe(babel({ // 编译es6
            presets: ['@babel/env']
          }))
          .pipe(uglify())  // 压缩、混淆
          .pipe(concat('bundle.js')) // 合并所有文件，输出all.js文件
          // .pipe(rename('bundle.js')) // 重命名为zbw.js
          .pipe(dest('./dist/js/'))  // 输出到根目录下dist文件夹
          .pipe(connect.reload()) // 热加载
}

/**
 * @description 处理css任务
 * @returns
 */
function cssTask() {
  return src('src/**/*.scss')
          .pipe(sass({
            outputStyle: 'compressed'
          }))
          .pipe(autoprefixer({
            cascade: false,
            remove: false // 删除过时的prefixer
          }))
          .pipe(dest('./dist'))
          .pipe(connect.reload())
}

/**
 * @description 监听任务
 */
function watcherTask() {
  watch('src/**/*.scss', cssTask)
  watch('src/**/*.js', jsTask)
  watch('src/index.html', htmlTask)
}

// server 任务必须在 watchTask之前
const assetsTask = series(cleanTask, htmlTask, jsTask, cssTask, serverTask)

const buildTask = parallel(assetsTask, watcherTask)

exports.default = buildTask;
