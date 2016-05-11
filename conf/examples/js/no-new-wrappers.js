// Bad
var stringObject = new String("Hello world");
var numberObject = new Number(33);
var booleanObject = new Boolean(false);

// Good 
var text = String(someValue);
var num = Number(someValue);