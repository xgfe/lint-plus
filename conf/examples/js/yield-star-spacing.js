// Bad
/*eslint yield-star-spacing: ["error", "before"]*/
function * generator() {
    yield *other();
}

// Good 
function *generator() {
    yield *other();
}