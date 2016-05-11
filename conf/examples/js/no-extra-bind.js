// Bad
var x = function () {
    foo();
}.bind(bar);

var x = (() => {
        foo();
}).bind(bar);

// Good 
var x = function () {
    this.foo();
}.bind(bar);

var x = function (a) {
    return a + 1;
}.bind(foo, bar);