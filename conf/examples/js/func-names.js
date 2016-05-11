// Bad
Foo.prototype.bar = function() {};

(function() {
    // ...
}())

// Good 
Foo.prototype.bar = function bar() {};

(function bar() {
    // ...
}())