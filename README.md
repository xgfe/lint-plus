# lint-plus
[xg-htmlhint](http://github.com/y8n/xg-htmlhint)+[xg-csslint](http://github.com/xgfe/xg-csshint)+[eslint](http://eslint.org)

## Install

From NPM for use as a command line app:

```
$ [sudo] npm install lint-plus -g
```
From NPM for programmatic use:

```
$ npm install lint-plus
```
## Usage
### Use in command line

```
$ linter [check] dir/               # lint entire directory
$ linter test.html src/ index.js    # lint files 
$ linter -c configfile test.html    # custom config file
```
### Use in your application

```
var linter = require('linter-plus');
```
#### API Reference

```
var files = ["test.html","test.js"];
function done (success,json,errors,errorFile,totalFile){
	console.log('isSuccess: %s',success);
	var messages;
    for(var i in json){
        messages = json[i];
        messages.forEach(function (message) {
            console.log('file %s has problem.',i);
            console.log('lint type: %s',message.type);
            console.log('problem severity: %s',message.severity);//2-error,1-warn,0-info
            console.log('line: %s',message.line);
            console.log('col: %s',message.col);
            console.log('error message: %s',message.message);
            console.log('rule: %s',message.rule);
        });
    }
	console.log('Found %s problem%s in %s of %s file%s.',
		errors,
		errors > 1 ? 's' : '',
		errorFile,
		totalFile, totalFile > 1 ? 's' : ''
	);
}
linter.check(files,done);
// or
var options = {
	_:["test.html","test.js"],
	config:'path/to/my/config_file'
};
linter.check(options,done);
```
## Config File Template
default to read `.lintrc` file.

```
{
	"html":{ //htmlhint config 
        "suffix":["html","htm"],  // file's suffix,array or string or regexp
        "rules":{
            "id-name-unique":false,
            "style-disabled":true
        }
    },
    "css":{  // csshint config 
        "suffix": "css",
        "ignore":["hehe.js","test/*.js"],   // files to be ignored,array or glob string
        "rules":{
            "a-line-of-decl": {"level": 1},
            "disallow-use-expression": {"level": 1},
            "vendor-prefixes-sort": {"level": 1}
        }
    },
    "js":false   // set false means disallow js checker
}
```
## Develop Guide
coming soon...
## License
MIT