// Bad
/*eslint quotes: ["error", "single"]*/
var single = 'single';
var unescaped = 'a string containing "double" quotes';
/*eslint quotes: ["error", "double"]*/
var double = "double";
var unescaped = "a string containing 'single' quotes";
// Good
/*eslint quotes: ["error", "double"]*/
var single = 'single';
var unescaped = 'a string containing "double" quotes';
/*eslint quotes: ["error", "single"]*/
var double = "double";
var unescaped = "a string containing 'single' quotes";