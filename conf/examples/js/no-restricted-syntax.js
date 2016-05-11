// Bad
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement"] */
with (me) {
    dontMess();
}
var doSomething = function () {};

// Good 
me.dontMess();
function doSomething() {};