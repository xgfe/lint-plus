var vfs = require('vinyl-fs');
var pkg = require('../package');
var _ = require('../lib/util');
var jsChecker = require('../lib/js/checker');
var htmlChecker = require('../lib/html/checker');
var cssChecker = require('../lib/css/checker');
var reporter = require('../lib/reporter');
/**
 * 命令行执行
 * @param options
 */
exports.run = function (options) {
    options = options || {};
    var src = _.budildPattern(options);
    console.time(pkg.name);
    vfs.src(src,{cwdbase: true, allowEmpty: true})
        .pipe(jsChecker.exec(options))
        .pipe(htmlChecker.exec(options))
        .pipe(cssChecker.exec(options))
        .pipe(reporter.showMessages(true))
        .once('done', function (success) {
            console.timeEnd(pkg.name);
            process.exit(success ? 0 : 1);
        });
};
/**
 * 用于作为外部npm包引用
 * @param options
 * @param {function} done - 结束之后的回调函数，参数如下
 *    {boolean} success - 是否成功
 *    {object} messages - 错误信息
 *    {number} errorCount - 错误数量
 *    {number} errorFileCount - 含有错误的文件数
 *    {number} totalFileCount - 所有被检验的文件
 */
exports.verify = function (options,done) {
    options = options || {};
    var src = _.budildPattern(options);
    if(!done || typeof done !== 'function'){
        done = function (success) {}
    }
    vfs.src(src,{cwdbase: true, allowEmpty: true})
        .pipe(jsChecker.exec(options))
        .pipe(htmlChecker.exec(options))
        .pipe(reporter.showMessages())
        .once('done', done);
};