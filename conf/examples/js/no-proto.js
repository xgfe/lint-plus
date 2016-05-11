// Bad
var a = obj.__proto__;
var a = obj["__proto__"];

// Good 
var a = Object.getPrototypeOf(obj);