// Bad
var foo_;
var __proto__ = {};
foo._bar();

// Good 
var _ = require('underscore');
var obj = _.contains(items, item);
obj.__proto__ = {};
var file = __filename;