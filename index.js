var fs = require('fs');
var path = require('path');

var dir = path.join(__dirname, './cli');
fs.readdirSync(dir).forEach(function (file) {
    var key = file.split('.')[0];
    if(key !== 'index'){
        exports[key] = require(path.join(dir, file)).verify;
        exports[key+'Sync'] = require(path.join(dir, file)).verifySync;
    }
});