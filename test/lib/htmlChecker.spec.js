/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试js checker
 */

var expect = require("expect.js");
var htmlChecker = require('../../lib/html/checker');
var reporter = require('../../lib/reporter').createNew();
var path = require('path');
var fs = require('fs');
var vfs = require('vinyl-fs');


describe('html checker', function () {
    var options = {
        _:'test/testfiles/files/test.html',
        config:'test/testfiles/lintrc'
    };
    var filepath = path.resolve(__dirname,'..','..',options._);
    var configpath = path.resolve(__dirname,'..','..',options.config);

    it('should get messages and config', function (done) {
        var msg;
        vfs.src(filepath)
            .pipe(htmlChecker.exec(options,reporter))
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
                var htmlConfig = JSON.parse(config).html; // config file
                expect(htmlChecker.config).to.eql(htmlConfig);
                done();
            });
    });
});