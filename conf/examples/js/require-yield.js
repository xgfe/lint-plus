// Bad
function* foo() {
    return 10;
}

// Good 
function* foo() {
    yield 5;
    return 10;
}