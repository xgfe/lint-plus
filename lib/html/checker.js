var _ = require('../util');
var reporter = require('../reporter');
var linter = require('xg-htmlhint').HTMLHint;
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (contents, filePath) {
    var config = this.config;
    var rules = config.rules || {};
    var messages = linter.verify(contents, rules);
    messages.forEach(function (message) {
        reporter.report(filePath,{
            type:'xg-htmlhint',
            severity:message.type==='error'?2:message.type==='warn'?1:0,
            line:message.line,
            col:message.col,
            message:message.message,
            rule:message.rule.id
        });
    });
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    return config.html;
};
module.exports = checker;