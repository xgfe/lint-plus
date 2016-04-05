var _ = require('../util');
var csshint = require("xg-csshint");
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (file) {
    var contents = file.contents.toString();
    var config = this.config,rules = {};
    if(config){
        rules = config.rules;
    }
    var cssParse=csshint(rules);
    var messages = [];
    try {
        messages = cssParse(contents);
    }catch(e){
        console.log('css parser error\nfile:%s',file.path);
    }
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
    return formatMessages;
};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    var configPath = _.getConfigFilePath(options);
    var extendCache = {};
    return _.mergeExtends(config.css,configPath,extendCache);
};
module.exports = checker;