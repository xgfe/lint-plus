// Bad
/*eslint no-restricted-modules: ["error", "fs", "cluster"]*/
var fs = require('fs');
var cluster = require(' cluster ');

// Good
var crypto = require('crypto');