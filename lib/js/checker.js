var _ = require('../util');
var linter = require('eslint').linter;
var Checker = require('../checker');
var checker = new Checker();

checker.check = function (contents, filePath,reporter) {
    var config = this.config;
    var messages = linter.verify(contents, config);
    messages.forEach(function (message) {
        reporter.report(filePath,{
            type:'eslint',
            severity:message.severity,
            line:message.line,
            col:message.column,
            message:message.message,
            rule:message.ruleId
        });
    });
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    var configPath = _.getConfigFilePath(options);
    var extendCache = {};
    return _.mergeExtends(config.js,configPath,extendCache);
};
module.exports = checker;