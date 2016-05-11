// Bad
function foo() {}
var foo = function() {};
var foo = () => {};

// Good 
function foo() {
    // do nothing.
}
var foo = function() {
    // any clear comments.
};