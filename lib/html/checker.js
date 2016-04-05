var _ = require('../util');
var linter = require('xg-htmlhint').HTMLHint;
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (file) {
    var contents = file.contents.toString();
    var config = this.config;
    var rules = config.rules || {};
    var messages = [];
    try {
        messages = linter.verify(contents, rules);
    }catch(e){
        console.log('html parser error\nfile:%s',file.path);
    }
    var formatMessages = messages.map(function (message) {
        return {
            type:'xg-htmlhint',
            severity:message.type==='error'?2:message.type==='warn'?1:0,
            line:message.line,
            col:message.col,
            message:message.message,
            rule:message.rule.id
        };
    });
    return formatMessages;
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    var configPath = _.getConfigFilePath(options);
    var extendCache = {};
    return _.mergeExtends(config.html,configPath,extendCache);
};
module.exports = checker;