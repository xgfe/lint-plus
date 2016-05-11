// Bad
function foo() {
    var bar;
    let baz;
}

// Good 
function foo() {
    var bar = 1;
    let baz = 2;
    const qux = 3;
}