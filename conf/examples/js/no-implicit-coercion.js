// Bad
var b = !!foo;
var b = ~foo.indexOf(".");

// Good 
var b = Boolean(foo);
var b = foo.indexOf(".") !== -1;
var n = ~foo; // This is a just bitwise not.