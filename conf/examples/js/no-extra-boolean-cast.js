// Bad
var foo = !!!bar;
var foo = !!bar ? baz : bat;
var foo = Boolean(!!bar);
var foo = new Boolean(!!bar);

// Good 
var foo = !!bar;
var foo = Boolean(bar);
function foo() {
    return !!bar;
}