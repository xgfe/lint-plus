var util = require('util');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mapStream = require('map-stream');
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
    var configFileContent = exports.mergeExtends(exports.loadConfigFile(config_path),config_path);
    //var configFileContent = fs.readFileSync(config_path,'utf-8');
    //try{
    //    configFileContent = JSON.parse(configFileContent);
    //}catch(e){
    //    configFileContent = {};
    //    throw new Error(colors.red('parse config file content fail'));
    //}
    CONFIG_FILE_CACHE = configFileContent;
    return configFileContent;
};
exports.loadConfigFile = function(filePath) {
    var config;
    switch (path.extname(filePath)) {
        case ".js":
        case ".json":
            config = require(filePath);
            break;
        default:
            try {
                config = JSON.parse(fs.readFileSync(filePath,'utf8'));
            } catch (e) {
                e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
                throw e;
            }
    }
    return config;
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
function deepmerge(source,target,isRule) {
    isRule = !!isRule;
    var dst;
    if(isRule){
        dst = {};
        for(var i in source){
            if(source.hasOwnProperty(i) && !(i in target)){
                dst[i] = source[i];
            }
        }
        for(var j in target){
            if(target.hasOwnProperty(j)){
                dst[j] = target[j];
            }
        }
        return dst;
    }
    var array = Array.isArray(target);
    dst = array && [] || {};

    if (array) {
        source = source || [];
        dst = dst.concat(source);
        target.forEach(function(e, i) {
            if (typeof dst[i] === 'undefined') {
                dst[i] = e;
            } else if (typeof e === 'object') {
                dst[i] = deepmerge(source[i], e,isRule);
            } else if(source.indexOf(e) === -1){
                dst.push(e);
            }
        });
    } else {
        if (source && typeof source === 'object') {
            Object.keys(source).forEach(function (key) {
                dst[key] = source[key];
            });
        }
        Object.keys(target).forEach(function (key) {
            if(["extends","suffix","ignore"].indexOf(key) !== -1){
                dst[key] = [];
                if(source[key]){
                    dst[key] = dst[key].concat(source[key]);
                }
                ([].concat(target[key])).forEach(function (val) {
                    if(dst[key].indexOf(val) === -1){
                        dst[key].push(val);
                    }
                });
            } else if (typeof target[key] !== 'object' || !target[key]) {
                dst[key] = target[key];
            } else if(source[key]){
                dst[key] = deepmerge(source[key], target[key], key === "rules");
            } else {
                dst[key] = target[key];
            }
        });
    }
    return dst;
}
exports.merge = deepmerge;
function isFilePath(filePath) {
    return isAbsolutePath(filePath) || !(/\w|@/).test(filePath.charAt(0));
}
function isAbsolutePath(path) {
    return path.charAt(0) === '/';
}

exports.load = function(filePath) {

    var config = exports.loadConfigFile(filePath);
    if (config) {
        if (config.extends) {
            config = exports.mergeExtends(config, filePath);
        }
    }
    return config;
};
var extendCache = {};
exports.mergeExtends = function (config,filePath) {
    if(!config){
        return false;
    }
    var configExtends = config.extends;
    if(!configExtends){
        return config;
    }
    configExtends = [].concat(config.extends);
    var configs = {
        "eslint:recommended":"../conf/eslint.json",
        "htmlhint:recommended":"../conf/htmlhint.json",
        "csshint:recommended":"../conf/csshint.json"
    };
    var allExtendsConfig = configExtends.reduce(function(previousValue, parentPath) {
        if(extendCache[parentPath]){
            return previousValue;
        }
        extendCache[parentPath] = true;
        if (configs.hasOwnProperty(parentPath)) {
            parentPath = path.resolve(__dirname, configs[parentPath]);
        } else if (isFilePath(parentPath)) {
            parentPath = (isAbsolutePath(parentPath) ?parentPath
                :path.resolve(filePath?path.dirname(filePath):process.cwd(), parentPath));
        }
        try {
            return exports.merge(previousValue,exports.load(parentPath));
        } catch (e) {
            e.message += "\nReferenced from "+parentPath+" error";
            throw e;
        }
    }, {});

    return exports.merge(allExtendsConfig,config);
};