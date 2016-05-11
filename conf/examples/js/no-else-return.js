// Bad
function foo() {
    if (x) {
        return y;
    } else {
        return z;
    }
}

// Good 
function foo() {
    if (x) {
        return y;
    }
    return z;
}