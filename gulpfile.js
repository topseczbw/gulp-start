const { series, src, dest, watch, parallel } = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
// const browserSync = require('browser-sync').create();
// const reload = browserSync.reload;
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

function serverTask() {
  connect.server({
    root: './',
    port: 8888,
    livereload: true,
    middleware: function(connect, opt) {
        return [
            proxy('/api/',  {
                target: 'https://devtk.aibeike.com',
                changeOrigin:true,
                pathRewrite: {
                  '^/': ''
                }
            })
        ]
    }
  })
}

/**
 * @description js任务
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
          .pipe(connect.reload())
          // .pipe(reload({ stream: true }))
}

/**
 * @description css任务
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
          // .pipe(reload({ stream: true }))
}

/**
 * @description 监听任务
 */
function watcherTask() {
  watch('src/**/*.scss', cssTask)
  watch('src/**/*.js', jsTask)
}

/**
 * @description 起服务
 * @param {function} done
 */
// function server(done) {
//   browserSync.init({
//     server: {
//       baseDir: './'  // 指定根目录
//     }
//   })
//   done()
// }


// server 任务必须在 watchTash之前
const buildTask = series(cleanTask, jsTask, cssTask, serverTask)

exports.default = parallel(buildTask, watcherTask);
