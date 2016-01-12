# lint-plus
[xg-htmlhint](http://github.com/yangjiyuan/xg-htmlhint)+[xg-csslint](http://github.com/xgfe/xg-csshint)+[eslint](http://eslint.org)

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
$ linter dir/                       # lint entire directory
$ linter test.html src/ index.js    # lint files 
$ linter file.js  js:--fix html:-c  # with arguments  
```
### Use in your application

```
var linter = require('linter-plus');
```
#### API Reference
The simple way

```
var files = ["test.html","test.js"];
var config = {
	lint:["html","js"],
	htmlhint:{
		"tagname-lowercase": true
	},
	eslint:{
		"rules": {
            "comma-dangle": [2, "never"]
       }
	}
};
linter.lint(files,config);
```
add argvs

```
linter.lint(files,config,{
	js:'--fix'
});
```
add reporter

```
var reporter = {};
linter.lint(files,config,null,reporter);
console.log(reporter.js); //error message on js file.
```
htmlhint function

```
var htmlhint_config = {
	"tagname-lowercase": true
};
var result = linter.htmlhint(files,htmlhint_config);
console.log(result.code);    //errorCode 1-error,0-normal
console.log(result.message); //error message
```
htmlhint function with argvs

```
var result = linter.htmlhint(files,htmlhint_config,'-c');
```
eslint function 

```
var eslint_config = {
	"env":{
		"node": true
	},
	"rules": {
		"comma-dangle": [2, "never"]
	}
};
var result = linter.eslint(files,eslint_config);
console.log(result.code);
console.log(result.message);
```
eslint function with argvs

```
var result = linter.eslint(files,eslint_config,'--fix -d');
```
## Develop Guide
The directory structure

```
├─ bin/   
   ├─ lin-plus
├─ test/
   ├─ test.html        // html file for test
   ├─ test.js          // js file for test
   ├─ linter.spec.js   // main test file
├─ .xgconfig           // configuration file for example
├─ index.js				// main file
├─ package.json			
```
run test by mocha

```
$ npm test
```
## License
MIT