# lint-plus
lint-plus = [xg-htmlhint](http://github.com/y8n/xg-htmlhint)+[xg-csslint](http://github.com/xgfe/xg-csshint)+[eslint](http://eslint.org)

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
    console.log('file %s has problem.',i);
    messages.forEach(function (message) {
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
  "html":false,     // set false means disallow js checker
  "css":{  // csshint config 
    "extends":["../path/to/other/css/config"]
    "suffix": "css",
    "ignore":["hehe.js","test/*.js"],   // files to be ignored,array or glob string
    "rules":{
      "a-line-of-decl": {"level": 1},
      "disallow-use-expression": {"level": 1},
      "vendor-prefixes-sort": {"level": 1}
    }
  },
  "js":{
    "extends":"eslint:recommended"   // extends config
  }
}
```
**Note:config file can be js or json file.js files must be a node module,contents are as follows.**

```
module.exports = {
  html:false,
  "css":{},
  js:{
    extends:"eslint:recommended"
  }
};
```
## Develop Guide
[开发文档](./docs/guide.md)

## Config File
[配置文件说明](./docs/config.md)

## License
MIT

## Thanks
- fecs:[http://fecs.baidu.com/](http://fecs.baidu.com/)
- eslint:[http://eslint.org](http://eslint.org)
- xg-htmlhint:[http://github.com/y8n/xg-htmlhint](http://github.com/y8n/xg-htmlhint)
- xg-csshint:[http://github.com/xgfe/xg-csshint](http://github.com/xgfe/xg-csshint)
- minimist:[https://github.com/substack/minimist](https://github.com/substack/minimist)
- vinyl-fs:[http://github.com/wearefractal/vinyl-fs](http://github.com/wearefractal/vinyl-fs)
- map-stream:[http://github.com/dominictarr/map-stream](http://github.com/dominictarr/map-stream)

