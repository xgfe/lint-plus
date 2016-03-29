/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试程序入口文件index.js
 */

var expect = require("expect.js");

describe('index cli', function () {
    var getOptions = require('../cli/index').getOptions;
    var argv,options;

    it('should get correct file paths', function () {

        argv = ['foldA','file.html'];
        options = getOptions(argv);
        expect(options._).to.eql(argv);

        argv = ['check','foldA','file.html'];
        options = getOptions(argv);
        argv.splice(0,1);
        expect(options._).to.eql(argv);
    });

    it('help flag should be true', function () {
        argv = ['foldA','file.html','-h'];
        options = getOptions(argv);
        expect(options.help).to.be(true);
        expect(options.h).to.be(true);

        argv = ['foldA','file.html','--help'];
        options = getOptions(argv);
        expect(options.help).to.be(true);
        expect(options.h).to.be(true);
    });

    it('version flag should be true', function () {
        argv = ['foldA','file.html','-v'];
        options = getOptions(argv);
        expect(options.version).to.be(true);
        expect(options.v).to.be(true);

        argv = ['foldA','file.html','--version'];
        options = getOptions(argv);
        expect(options.version).to.be(true);
        expect(options.v).to.be(true);
    });

    it("should exec 'check' command", function () {
        argv = ['foldA','file.html'];
        options = getOptions(argv);
        expect(options.command).to.be('check');
    });

    it("should have config arg", function () {
        var config = 'lintrc';
        argv = ['foldA','file.html','-c',config];
        options = getOptions(argv);
        expect(options.config).to.be(config);
    });
});

