/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试js checker
 */

var expect = require("expect.js");
var jsChecker = require('../../lib/js/checker');
var reporter = require('../../lib/reporter').createNew();
var path = require('path');
var fs = require('fs');
var vfs = require('vinyl-fs');


describe('js checker', function () {
    var options = {
        _:'test/testfiles/files/test.js',
        config:'test/testfiles/lintrc'
    };
    var filepath = path.resolve(__dirname,'..','..',options._);
    var configpath = path.resolve(__dirname,'..','..',options.config);
    // 只调用一次exec方法,不然extends的配置会被cache,从而无法再次继承
    it('should get messages and config', function (done) {
        var msg;
        vfs.src(filepath)
            .pipe(jsChecker.exec(options,reporter))
            .pipe(reporter.showMessages())
            .on('done', function (success,messages,errorCount,errorFileCount,totalFileCount) {
                expect(success).to.be(false);
                expect(errorCount).to.be(2);
                expect(errorFileCount).to.be(1);
                expect(totalFileCount).to.be(1);
                msg = messages;
            })
            .on('end', function () {
                var messages = reporter.getMessages();
                expect(messages).to.eql(msg);

                var config = fs.readFileSync(configpath,'utf8');
                var jsConfig = JSON.parse(config).js; // config file
                var eslintConfig = require('../../conf/eslint.json').rules;
                expect(jsChecker.config.rules).to.eql(eslintConfig); // extends eslint rules
                expect(jsChecker.config.suffix).to.eql(jsConfig.suffix); // own suffix
                done();
            });
    });
});