// Bad
function foo() {
    var bar;
    var baz;
    let qux;
    let norf;
}

// Good 
function foo() {
    var bar,
        baz;
    let qux,
        norf;
}
