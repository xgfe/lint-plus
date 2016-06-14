var _ = require('../util');
var util = require('util');
var path = require('path');
var CLIEngine = require("eslint").CLIEngine;
var Checker = require('../checker');
var checker = new Checker();
var cli;
checker.check = function (file) {
    var config = this.config;
    //config.ignore = false;
    //config.extensions = [].concat(config.suffix).map(function (ext) {
    //    return '.'+ext;
    //});
    config.useEslintrc = false;
    if(!cli){
        cli = new CLIEngine(config);
        if(checker.customPlugins.length){
            var pluginName,pluginPath;
            checker.customPlugins.forEach(function (plugin) {
                pluginName = Object.keys(plugin)[0];
                if(pluginName){
                    pluginPath = path.resolve(path.dirname(checker.configFilePath),plugin[pluginName]);
                    try{
                        cli.addPlugin('eslint-plugin-'+pluginName, require(pluginPath));
                    }catch(err){
                        throw new Error('Cannot load plugin: [eslint-plugin-'+pluginName+'] in '+pluginPath);
                    }
                }
            });
        }
    }
    var contents = file.contents.toString();
    var report = cli.executeOnText(contents,file.path);
    if (config.fix) { // 修复
        CLIEngine.outputFixes(report);
    }
    var messages = report.results[0].messages;
    var formatMessages = messages.map(function (message) {
        return {
            type:'eslint',
            severity:message.severity,
            line:message.line,
            col:message.column,
            message:message.message,
            rule:message.ruleId
        };
    });
    return formatMessages;
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    var configPath = _.getConfigFilePath(options);
    var extendCache = {};
    var baseConfig = _.mergeExtends(config.js,configPath,extendCache);

    baseConfig.globals = formatGlobalsEnv(baseConfig.globals);
    baseConfig.envs = formatGlobalsEnv(baseConfig.env); // fix env and envs
    baseConfig.plugins = formatPlugins(baseConfig.plugins,checker);
    baseConfig.fix = baseConfig.fix || options.fix;
    return baseConfig;
};
/**
 * 将globals和env转化为数组
 * @param obj
 * @returns {*}
 */
function formatGlobalsEnv(obj){
    if(util.isArray(obj)){
        return [].concat(obj);
    }
    if(util.isObject(obj)){
        var result = [];
        var keys = Object.keys(obj),key,len = keys.length;
        while(len--){
            key = keys[len];
            if(obj[key] === true){
                result.push(key);
            }
        }
        return result;
    }
    if(util.isString(obj)){
        return [obj];
    }
    return [];
}
/**
 * 格式化plugins属性,plugins的格式可以为以下几种
 * plugins:"react"
 * plugins:{"react":"../lib/eslint-plugin-react"}
 * plugins:["react"]
 * plugins:["react",{"react":"../lib/eslint-plugin-react"}]
 * @param plugins
 * @param checker
 * @returns {*}
 */
function formatPlugins(plugins,checker){
    if(!checker.customPlugins){
        checker.customPlugins = [];
    }
    var results = [];
    if(util.isString(plugins)){
        return [plugins];
    }
    if(util.isArray(plugins)){
        plugins.forEach(function (plugin) {
            if(util.isString(plugin)){
                results.push(plugin);
            }else if(util.isObject(plugin)){
                checker.customPlugins.push(plugin);
            }
        });
        return results;
    }
    if(util.isObject(plugins)){
        checker.customPlugins.push(plugins);
        return [];
    }
    return [];
}
module.exports = checker;