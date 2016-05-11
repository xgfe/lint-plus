// Bad
if (foo == NaN) {
    // ...
}

// Good 
if (isNaN(foo)) {
    // ...
}