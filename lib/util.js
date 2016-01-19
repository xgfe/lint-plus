var util = require('util');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mapStream  = require('map-stream');
var colors = require('colors');

var CONFIG_NAME = '.lintrc';
var CONFIG_FILE_CACHE;
exports.getConfigFileContent = function(options){
    if(CONFIG_FILE_CACHE){
        return CONFIG_FILE_CACHE;
    }
    var root = process.cwd(),config = options.config,config_path;
    config = config || CONFIG_NAME;
    config_path = path.resolve(root,config);
    if(!fs.existsSync(config_path)){
        throw new Error(colors.red('invalid config file path:'+config_path));
    }
    var configFileContent = fs.readFileSync(config_path).toString();
    try{
        configFileContent = JSON.parse(configFileContent);
    }catch(e){
        configFileContent = {};
    }
    CONFIG_FILE_CACHE = configFileContent;
    return configFileContent;
};
exports.getSubPath = function (path) {
    return path.replace(process.cwd()+'/','');
};
/**
 * 构建用于文件名匹配的正则
 */
exports.buildSuffixReg = function (stringSplitByComma) {
    if (util.isRegExp(stringSplitByComma)) {
        return stringSplitByComma;
    }
    if (!stringSplitByComma) {
        return /.*/i;
    }
    var array = String(stringSplitByComma).replace(/[^a-z\d_,\s]/gi, '\\$&').split(/\s*,\s*/);
    var reg = array.length === 1 ? array[0] : '(' + array.join('|') + ')';
    return new RegExp('\\.' + reg + '$', 'i');
};
exports.getIgnoreFiles = function (ignore) {
    var files=[];
    function push(file){
        if(files.indexOf(file) === -1){
            files.push(file);
        }
    }
    if(util.isArray(ignore)){
        ignore.forEach(function (pattern) {
            glob.sync(pattern).forEach(push);
        });
    }else{
        glob.sync(ignore).forEach(push);
    }
    return files;
};
exports.budildPattern = function (options) {
    var paths;
    if(util.isArray(options)){
        paths = options;
    }else if(util.isObject(options) && options._ && options._.length){
        if(util.isString(options._)){
            paths = [options._];
        }else {
            paths = options._;
        }
    }else{
        paths = ['**/*'];
    }
    paths = paths.map(function (dir) {
        if(fs.existsSync(dir)){
            var stat = fs.statSync(dir);
            return stat.isDirectory()?path.join(dir, '/**/*'):dir;
        }
        return dir;
    });
    paths.push('!**/{node_modules,bower_components}/**');
    return paths;
};
exports.mapStream = function (transform, flush) {
    var stream = mapStream(transform);
    if (typeof flush === 'function') {
        stream.on('end', flush);
    }
    return stream;
};