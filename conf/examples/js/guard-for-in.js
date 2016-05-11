// Bad
for (key in foo) {
    doSomething(key);
}

// Good 
for (key in foo) {
    if ({}.hasOwnProperty.call(foo, key)) {
        doSomething(key);
    }
}