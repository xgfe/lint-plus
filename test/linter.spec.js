var assert = require('assert');
var linter = require('../');
var path = require('path');
var fs = require('fs');

var test_html = path.resolve(__dirname, 'test.html');
var test_js = path.resolve(__dirname, 'test.js');
var config = path.resolve(__dirname, '../.xgconfig');
var configFile = fs.readFileSync(config),lintConfig;

var result;
describe('lint-plus', function () {
    beforeEach(function (done) {
        lintConfig = JSON.parse(configFile);
        done();
    });
    describe('lint-all', function () {
        // 测试时间过长，分成四部分
        it('lint xg-htmlhint and eslint--1', function (done) {
            setNormalHTML();
            setNormalJS();
                result = linter.lint([test_html,test_js],lintConfig);
            assert(result === 0);
            done();
        });
        it('lint xg-htmlhint and eslint--2', function (done) {
            setErrorHTML();
            setNormalJS();
            result = linter.lint([test_html,test_js],lintConfig);
            assert(result === 1);
            done();
        });
        it('lint xg-htmlhint and eslint--3', function (done) {
            setNormalHTML();
            setErrorJS();
            result = linter.lint([test_html,test_js],lintConfig);
            assert(result === 1);
            done();
        });
        it('lint xg-htmlhint and eslint--4', function (done) {
            setErrorHTML();
            setErrorJS();
            result = linter.lint([test_html,test_js],lintConfig);
            assert(result === 1);
            done();
        });
        it('"lint" function and no arguments', function (done) {
            result = linter.lint('',lintConfig);
            assert(result === 1);
            done();
        });

        it('with arguments', function (done) {
            setErrorJS();
            result = linter.lint([test_js],lintConfig,{
                js:'--fix'
            });
            assert(result === 0);
            done();
        });

        it('config "lint" in config file', function (done) {
            lintConfig.lint = [];
            setErrorHTML();
            setErrorJS();
            result = linter.lint([test_html,test_js],lintConfig);
            assert(result === 0);
            done();
        });

    });

    describe('test xg-htmlhint', function () {
        it('error html and "lint" function should result in an error.', function (done) {
            setErrorHTML();
            var reporter = {};
            result = linter.lint(test_html,lintConfig,null,reporter);
            assert(result === 1);
            assert(reporter.html.indexOf('line 1, col 6: Inline style is not allowed.') !== -1);
            done();
        });
        it('no-error html and "lint" function should result in an error.', function (done) {
            setNormalHTML();
            var reporter = {};
            result = linter.lint(test_html,lintConfig,null,reporter);
            assert(result === 0);
            assert(!reporter.html);
            done();
        });

        it('no file and "htmlhint" function should result in an error.', function (done) {
            result = linter.htmlhint('',lintConfig.htmlhint);
            assert(result.code === 1);
            done();
        });
        it('error file and "htmlhint" function should result in an error.', function (done) {
            setErrorHTML();
            result = linter.htmlhint(test_html,lintConfig.htmlhint);
            assert(result.code === 1);
            assert(result.message.indexOf('line 1, col 6: Inline style is not allowed.') !== -1);
            done();
        });
        it('no error file and "htmlhint" function should result in an error.', function (done) {
            setNormalHTML();
            result = linter.htmlhint(test_html,lintConfig.htmlhint);
            assert(result.code === 0);
            assert(result.message === '');
            done();
        });
    });

    describe('test eslint', function () {
        it('error js file and "lint" function should result in an error.', function (done) {
            setErrorJS();
            var reporter = {};
            result = linter.lint(test_js,lintConfig,null,reporter);
            assert(result === 1);
            assert(reporter.js.indexOf('error  Unnecessary semicolon  no-extra-semi') !== -1);
            done();
        });

        it('no error js file and "lint" function should not result in an error', function (done) {
            setNormalJS();
            var reporter = {};
            result = linter.lint(test_js,lintConfig,null,reporter);
            assert(result === 0);
            assert(reporter.js === '');
            done();
        });
        it('without config should not result in an error', function (done) {
            setNormalJS();
            delete lintConfig.eslint;
            var reporter = {};
            result = linter.lint(test_js,lintConfig,null,reporter);
            assert(result === 0);
            assert(reporter.js === '');
            done();
        });
        it('error js file with arguments.', function (done) {
            setErrorJS();
            var reporter = {};
            result = linter.lint(test_js,lintConfig,{
                js:'--fix'
            },reporter);
            assert(result === 0);
            assert(reporter.js === '');
            done();
        });

        it('no file and "eslint" function.', function (done) {
            result = linter.eslint('',lintConfig.eslint);
            assert(result.code === 1);
            done();
        });
        it('error js file and "eslint" function should result in an error.', function (done) {
            setErrorJS();
            result = linter.eslint(test_js,lintConfig.eslint);
            assert(result.code === 1);
            assert(result.message.indexOf('error  Unnecessary semicolon  no-extra-semi') !== -1);
            done();
        });
        it('html file and "eslint" function should not result in an error.', function (done) {
            setNormalJS();
            result = linter.eslint(test_html,lintConfig.eslint);
            assert(result.code === 0);
            assert(result.message === '');
            done();
        });
        it('error js file and "eslint" function with arguments.', function (done) {
            setErrorJS();
            result = linter.eslint(test_js,lintConfig.eslint,'--fix');
            assert(result.code === 0);
            assert(result.message === '');
            done();
        });
    });
});
function setErrorHTML(){
    fs.writeFileSync(test_html,'<div style="font-size: 12px;"></div>','utf8');
}
function setNormalHTML(){
    fs.writeFileSync(test_html,'<div>test</div>','utf8');
}
function setErrorJS(){
    fs.writeFileSync(test_js,'var str = "Hello World";;console.log(str);','utf8');
}
function setNormalJS(){
    fs.writeFileSync(test_js,'var str = "Hello World";console.log(str);','utf8');
}