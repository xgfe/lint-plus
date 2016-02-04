var _ = require('../util');
var reporter = require('../reporter');
var csshint = require("xg-csshint");
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (contents, filePath) {
    var config = this.config,rules = {};
    if(config){
        rules = config.rules;
    }
    var cssParse=csshint(rules);
    var messages = cssParse(contents);
    messages.forEach(function (message) {
        reporter.report(filePath,{
            type:'xg-csshint',
            severity:message.level===1?2:message.level===2?1:0,
            line:message.line,
            col:message.column,
            message:message.text,
            rule:message.plugin
        });
    });
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    return _.mergeExtends(config.css);
};
module.exports = checker;