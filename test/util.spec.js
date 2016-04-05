/**
 * 2016-3-28
 * yjy972080142@gmail.com
 * 测试工具函数
 */

var expect = require("expect.js");
var _ = require('../lib/util');
var fs = require('fs');
var path = require('path');

describe('util function', function () {
    var options = {
        _:['test/testfiles/files'],
        config:"test/testfiles/lintrc"
    };
    var rootPath = process.cwd()+'/';

    it('should get config file content', function () {
        var content = fs.readFileSync(rootPath+options.config,'utf8');
        content = JSON.parse(content);
        var _content = _.getConfigFileContent(options);
        expect(content).to.eql(_content);
    });

    it('load config file', function () {
        var filePath = rootPath+options.config;
        var content = fs.readFileSync(filePath,'utf8');
        content = JSON.parse(content);
        var _content = _.loadConfigFile(filePath);
        expect(content).to.eql(_content);
    });

    it('get sub path', function () {
        var filepath = rootPath+options.config;
        var subpath = _.getSubPath(filepath);
        expect(subpath).to.equal(options.config);
    });

    it('build suffix regExp', function () {
        var suffix,suffixReg;

        // build by string
        suffix = 'html';
        suffixReg = _.buildSuffixReg(suffix);
        expect('test.html').to.match(suffixReg);
        expect('test.html.js').to.not.match(suffixReg);

        // build by array
        suffix = ['css','scss'];
        suffixReg = _.buildSuffixReg(suffix);
        expect('test.css').to.match(suffixReg);
        expect('test.scss').to.match(suffixReg);
        expect('test.html').to.not.match(suffixReg);

        // build by regExp
        suffix = /\.(es|js)$/;
        suffixReg = _.buildSuffixReg(suffix);
        expect('test.es').to.match(suffixReg);
        expect('test.css').to.not.match(suffixReg);
    });

    it('get ignore files', function () {
        var ignore,files;

        // build by string
        ignore = 'test/testfiles/**/*.js';
        files = _.getFilesByGlob(ignore);
        expect(files).to.eql(['test/testfiles/files/test.js']);
    });

    it('budild pattern', function () {
        var pattern = _.budildPattern(options);
        var files = _.getFilesByGlob(pattern);
        var subpath = options._[0];
        var paths = fs.readdirSync(rootPath+subpath).map(function (filename) {
            return subpath+'/'+filename;
        });
        expect(files).to.eql(paths);
    });

    it('map stream', function () {
        var stream = _.mapStream(function () {});
        expect(stream).to.be.a(require('stream').Stream);
    });

    it('deep merge', function () {
        var target = {
            css:false,
            js:{
                'extends':'eslint:recommended',
                rules:{
                    curly:[2,'prop']
                }
            }
        };
        var src = { // 被继承
            html:{
                suffix:['htm','shtml'],
                ignore:'node_modules/*.html',
                rules:{
                    'parent-rule':true
                }
            },
            css:{
                suffix:'css'
            },
            js:{
                suffix:'js',
                rules:{
                    hehe:[2],
                    curly:1
                }
            }
        };
        var config = _.merge(src,target);
        // html config
        expect(config.html.suffix).to.have.length(2);
        expect(config.html.suffix).to.contain('shtml');
        expect(config.html.suffix).to.contain('htm');

        expect(config.html.ignore).to.be('node_modules/*.html');

        expect(config.html.rules).to.eql(src.html.rules);
        // css config
        expect(config.css).to.be(false);
        // js config
        expect(config.js.suffix).to.be('js');
        expect(config.js.extends).to.eql(['eslint:recommended']);
        expect(config.js.rules).to.have.property('hehe', src.js.rules.hehe);
        expect(config.js.rules).to.have.property('curly', target.js.rules.hehe);
    });

    // mergeExtends和load 方法还没有好的测试方案,delay
    it('create file', function () {
        var subpath = 'test/testfiles/lintrc';
        var filepath  =path.resolve(process.cwd(),subpath)
        var file = _.createFile(subpath);

        expect(file.cwd).to.be(path.dirname(filepath));
        expect(file.path).to.be(filepath);
        expect(file.contents).to.be(fs.readFileSync(filepath,'utf8').toString());
        expect(file.isNull()).to.be(false);
    });
});