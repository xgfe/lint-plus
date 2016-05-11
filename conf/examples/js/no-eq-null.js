// Bad
if (foo == null) {
    bar();
}
while (qux != null) {
    baz();
}

// Good 
if (foo === null) {
    bar();
}
while (qux !== null) {
    baz();
}