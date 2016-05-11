// Bad
var num = parseInt("071");
var num = parseInt(someValue);
var num = parseInt("071", "abc");

// Good
var num = parseInt("071", 10);
var num = parseInt("071", 8);
var num = parseFloat(someValue);