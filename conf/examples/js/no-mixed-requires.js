// Bad
var async = require('async'),
    debug = require('diagnostics').someFunction('my-module'),
    eslint = require('eslint');

// Good 
var eventEmitter = require('events').EventEmitter,
    myUtils = require('./utils'),
    util = require('util'),
    bar = require(getBarModuleName());