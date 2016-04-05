var _ = require('../util');
var linter = require('eslint').linter;
var Checker = require('../checker');
var checker = new Checker();

checker.check = function (file) {
    var contents = file.contents.toString();
    var config = this.config;
    var messages = [];
    try {
        messages = linter.verify(contents, config);
    }catch(e){
        console.log('html parser error\nfile:%s',file.path);
    }
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
    return _.mergeExtends(config.js,configPath,extendCache);
};
module.exports = checker;