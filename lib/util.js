var util = require('util');
var fs = require('fs');
var path = require('path');
var globby = require('globby');
var mapStream = require('map-stream');
var colors = require('colors');

var CONFIG_NAME = '.lintrc';
var CONFIG_FILE_CACHE;
/**
 * 获取配置文件据对路径
 * @param options 配置
 * @returns {string}
 */
exports.getConfigFilePath = function (options) {
    var root = process.cwd(),config = options.config,config_path;
    config = config || CONFIG_NAME;
    return path.resolve(root,config);
};
/**
 * 获取配置文件内容
 * @param options 配置
 * @returns {*}
 */
exports.getConfigFileContent = function(options){
    if(CONFIG_FILE_CACHE){
        return CONFIG_FILE_CACHE;
    }
    var config_path = exports.getConfigFilePath(options);
    if(!fs.existsSync(config_path)){
        throw new Error(colors.red('invalid config file path:'+config_path));
    }
    var cache = {};
    var configFileContent = exports.mergeExtends(exports.loadConfigFile(config_path),config_path,cache);
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
/**
 * 根据不同的文件类型加载配置文件
 * @param filePath 配置路径
 * @returns {*}
 */
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
/**
 * 获取相对路径
 * @param path
 * @returns {string}
 */
exports.getSubPath = function (path) {
    return path.replace(process.cwd()+'/','');
};
/**
 * 构建用于文件后缀名匹配的正则
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
/**
 * 获取被忽略的文件路径
 * @param globs 文件集合,glob格式
 * @return {array} 文件路径
 */
exports.getFilesByGlob = function (globs) {
    globs = [].concat(globs);
    return globby.sync(globs,{nodir:true}) || [];
};
/**
 * 构建vfs用于获取文件的正则
 * @param options - 配置
 */
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
/**
 * 构建文件流
 * @param transform
 * @param flush
 * @returns {*}
 */
exports.mapStream = function (transform, flush) {
    var stream = mapStream(transform);
    if (typeof flush === 'function') {
        stream.on('end', flush);
    }
    return stream;
};
/**
 * 深度合并对象
 * @param source 源对象
 * @param target 目标对象
 * @param isRule 是否是规则
 * @returns {*}
 */
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
            if(["extends","suffix","ignore"].indexOf(key) !== -1){ // 这三个属性做特殊处理
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
/**
 * 判断是否是文件路径
 * @param filePath
 * @returns {boolean}
 */
function isFilePath(filePath) {
    return isAbsolutePath(filePath) || !(/\w|@/).test(filePath.charAt(0));
}
/**
 * 判断是否是绝对路线
 * @param path
 * @returns {boolean}
 */
function isAbsolutePath(path) {
    return path.charAt(0) === '/';
}
/**
 * 加载文件内容
 * @param filePath - 文件路径
 * @param extendCache - 缓存
 * @returns {*}
 */
exports.load = function(filePath,extendCache) {

    var config = exports.loadConfigFile(filePath);
    if (config) {
        if (config.extends) {
            config = exports.mergeExtends(config, filePath,extendCache);
        }
    }
    return config;
};
/**
 * 合并extends
 * @param config 配置
 * @param filePath 配置路径
 * @param extendCache 用于记录缓存
 * @returns {*}
 */
exports.mergeExtends = function (config,filePath,extendCache) {
    if(!config){
        return false;
    }
    if(!extendCache){
        extendCache = {};
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
            return exports.merge(previousValue,exports.load(parentPath,extendCache));
        } catch (e) {
            e.message += "\nReferenced from "+parentPath+" error";
            throw e;
        }
    }, {});

    return exports.merge(allExtendsConfig,config);
};
/**
 * 创建文件的对象
 * @param subpath
 * @returns {{}}
 */
exports.createFile = function (subpath) {
    var file = {};
    file.path = path.resolve(process.cwd(),subpath);
    file.contents = fs.readFileSync(file.path,'utf8').toString();
    file.isNull = function () {
        return this.contents === '';
    };
    file.cwd = path.dirname(file.path);
    return file;
};