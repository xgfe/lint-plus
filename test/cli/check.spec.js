/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试check命令
 */

var expect = require("expect.js");
var check = require('../../cli/check');

describe('check cli', function () {
    it('test verify fn in check command', function (done) {
        var verify = check.verify;
        var options = {
            _: [ 'test/testfiles/files/' ],
            config: 'test/testfiles/lintrc'
        };
        verify(options, function (success) {
            expect(success).to.be(false);
            done();
        });
    });
    it('test verifySync fn in check command', function (done) {
        var verifySync = check.verifySync;
        var options = {
            _: [ 'test/testfiles/files/' ],
            config: 'test/testfiles/lintrc'
        };
        var messages = verifySync(options);
        expect(messages).to.not.be.empty();
        done();
    });
});