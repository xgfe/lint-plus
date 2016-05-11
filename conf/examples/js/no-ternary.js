//no-ternary
// Bad 
var foo = isBar ? baz : qux;
foo ? bar() : baz();
function quux() {
    return foo ? bar : baz;
}

// Good 
var foo;
if (isBar) {
    foo = baz;
} else {
    foo = qux;
}
if (foo) {
    bar();
} else {
    baz();
}