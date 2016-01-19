var _ = require('../util');
var reporter = require('../reporter');
var Checker = require('../checker');

var checker = new Checker();

checker.check = function (contents, filePath) {

};
checker.getConfig = function (options) {
    var config = _.getConfigFileContent(options);
    return config.html;
};
module.exports = checker;