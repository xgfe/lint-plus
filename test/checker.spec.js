/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试checker对象
 */

var expect = require("expect.js");
var Checker = require('../lib/checker');
var path = require('path');
var fs = require('fs');
var vfs = require('vinyl-fs');


describe('checker', function () {
    var checker;
    beforeEach(function () {
        checker = null
    });
    it('test constroctor', function () {
        checker = new Checker();
        expect(checker.isValid).to.be.a('function');
        expect(checker.check).to.be.a('function');
        expect(checker.getConfig).to.be.a('function');
        expect(checker.exec).to.be.a('function');
    });

    it('check method should be not implement yet', function () {
        checker = new Checker();
        expect(checker.check).to.throwError();
    });

    it('implement check and getConfig method', function (done) {
        checker = new Checker();
        checker.check = function (file) {
            checker.foo = {
                contents: file.contents.toString(),
                filePath: file.path
            }
        };
        var config = {
            suffix: 'js'
        };
        checker.getConfig = function () {
            return config;
        };
        var options = {
            _: 'testfiles/files/test.js'
        };
        var filepath = __dirname + '/' + options._;
        vfs.src(filepath)
            .pipe(checker.exec(options))
            .on('end', function () {
                var temp = {
                    contents: fs.readFileSync(filepath, 'utf8'),
                    filePath: filepath
                };
                expect(checker.foo).to.eql(temp);
                expect(checker.config).to.eql(config);
                done();
            });
    });

});