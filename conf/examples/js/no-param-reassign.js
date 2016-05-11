// Bad
function foo(bar) {
    bar = 13;
}


// Good 
function foo(bar) {
    var baz = bar;
}