// Bad
var x = new Function("a", "b", "return a + b");
var x = Function("a", "b", "return a + b");

// Good 
var x = function (a, b) {
    return a + b;
};