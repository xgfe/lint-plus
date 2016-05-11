// Bad
function foo() {}
foo = bar;

function foo() {
    foo = bar;
}

// Good 
var foo = function () {}
foo = bar;

function foo(foo) { // `foo` is shadowed.
    foo = bar;
}
