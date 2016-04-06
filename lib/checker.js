var _ = require('./util');
/**
 * Checker 基类
 */
var Checker = function () {};

/**
 * 检查当前文件是否可被检查
 */
Checker.prototype.isValid = function (file) {
    var config = this.config;
    var path = _.getSubPath(file.path);

    if (!this._suffixReg) {
        this._suffixReg = _.buildSuffixReg(config.suffix);
    }

    var result = this._suffixReg.test(path);

    if (config.ignore) {
        this.ignoreFiles = this.ignoreFiles || _.getFilesByGlob(config.ignore);
        result = result && this.ignoreFiles.indexOf(path) === -1;
    }

    return result && !file.isNull();
};


/**
 * 执行对文件内容的检查
 */
Checker.prototype.check = function () {
    throw new Error('check method not implement yet.');
};
Checker.prototype.getConfig = function () {};
/**
 * 对文件流执行检查
 */
Checker.prototype.exec = function (options,reporter,stream) {
    var checker = this;
    checker.config = checker.getConfig(options);
    checker.reporter = reporter;
    return _.mapStream(
        function (file, cb) {
            if(!checker.config || !checker.isValid(file)){
                cb(null, file);
                return;
            }
            var messages = checker.check(file);
            if(reporter){
                messages.forEach(function (message) {
                    reporter.report(file.path,message);
                });
            }
            if(stream && stream.emit){
                stream.emit('lint',file.path,messages);
            }
            cb(null, file);
        }
    );
};
// 同步检测文件
Checker.prototype.execSync = function (subpath,options,reporter) {
    var checker = this;
    checker.config = checker.getConfig(options);
    checker.reporter = reporter;
    var file = _.createFile(subpath); // 构建file对象
    if(!checker.config || !checker.isValid(file)){
        return;
    }
    var messages = checker.check(file);
    if(reporter){
        messages.forEach(function (message) {
            reporter.report(file.path,message);
        });
    }
};

module.exports = Checker;
