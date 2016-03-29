var _ = require('../util');
var csshint = require("xg-csshint");
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (contents, filePath,done) {
    var config = this.config,rules = {};
    if(config){
        rules = config.rules;
    }
    var cssParse=csshint(rules);
    var messages = cssParse(contents);
    var formatMessages = messages.map(function (message) {
        return {
            type:'xg-csshint',
            severity:message.level===1?2:message.level===2?1:0,
            line:message.line,
            col:message.column,
            message:message.text,
            rule:message.plugin
        };
    });
    if(done){
        done(filePath,formatMessages);
    }
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    var configPath = _.getConfigFilePath(options);
    var extendCache = {};
    return _.mergeExtends(config.css,configPath,extendCache);
};
module.exports = checker;