var _ = require('../util');
var reporter = require('../reporter');
var csshint = require("xg-csshint");
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (contents, filePath) {
    var config = this.config;
    var cssParse=csshint(config);
    var messages = cssParse(contents);
    messages.forEach(function (message) {
        reporter.report(filePath,{
            type:'xg-csshint',
            severity:message.level,
            line:message.line,
            col:message.column,
            message:message.content,
            rule:message.plugin
        });
    });
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    return config.css;
};
module.exports = checker;