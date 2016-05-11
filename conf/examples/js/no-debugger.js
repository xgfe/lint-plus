// Bad
function isTruthy(x) {
    debugger;
    return Boolean(x);
}

// Good 
function isTruthy(x) {
    return Boolean(x); // set a breakpoint at this line
}