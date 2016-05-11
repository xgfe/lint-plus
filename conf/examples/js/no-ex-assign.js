// Bad
try {
    // code
} catch (e) {
    e = 10;
}

// Good 
try {
    // code
} catch (e) {
    var foo = 'bar';
}