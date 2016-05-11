// Bad
function doSomething() {
    return foo = bar + 2;
}

// Good 
function doSomething() {
    return foo == bar + 2;
}