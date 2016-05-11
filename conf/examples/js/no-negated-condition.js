// Bad
if (!a) {
    doSomething();
} else {
    doSomethingElse();
}

// Good 
if (a) {
    doSomethingElse();
} else {
    doSomething();
}