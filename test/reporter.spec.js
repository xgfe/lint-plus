/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试消息
 */

var expect = require("expect.js");
var Reporter = require('../lib/reporter');
var path = require('path');
var fs = require('fs');
var vfs = require('vinyl-fs');

describe('reporter tool', function () {
    var options = {
        _: 'testfiles/files/test.js'
    };
    var filepath = __dirname + '/' + options._;
    var msgs = {};
    msgs[filepath] = [
        {type:'type1',severity:1,line:'line1',col:'col1',message:'message1',rule:'rule1'},
        {type:'type2',severity:2,line:'line2',col:'col2',message:'message2',rule:'rule2'}
    ];
    var reporter;
    beforeEach(function () {
        reporter = Reporter.createNew();
        for(var file in msgs){
            if(msgs.hasOwnProperty(file)){
                msgs[file].forEach(function (error) {
                    reporter.report(file,error);
                });
            }
        }
    });
    it('test getMessage fn', function () {
        var getMessages = reporter.getMessages();
        expect(msgs).to.eql(getMessages);
    });

    it('should get all msg', function (done) {
        vfs.src(filepath)
            .pipe(reporter.showMessages())
            .on('done', function (success,messages,errorCount,warningCount,errorFileCount,totalFileCount) {
                expect(success).to.be(false);
                expect(messages).to.eql(msgs);
                expect(errorCount).to.be(1);
                expect(warningCount).to.be(1);
                expect(errorFileCount).to.be(1);
                expect(totalFileCount).to.be(1);
                done();
            });
    });
});