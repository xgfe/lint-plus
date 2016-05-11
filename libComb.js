var libs = [
    //'lib/jquery/jquery.min.js',
    //'lib/angular/angular.min.js',
    //'lib/jszip-3.0.0/jszip.min.js',
    //'lib/file-saver/file-saver.min.js',
    'lib/highlight/highlight.pack.js',
    //'lib/angular-sanitize/angular-sanitize.min.js',
    'lib/ui-fugu/ui-fugu.min.js'
];
var dist = 'assets/js/lib.js';
var fs = require('fs');
var content = '';
libs.forEach(function (libpath) {
    content += fs.readFileSync(libpath,'utf8') + '\n';
});
fs.writeFileSync(dist,content,'utf8');
