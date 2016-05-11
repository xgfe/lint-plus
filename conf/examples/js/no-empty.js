// Bad
if (foo) {
}

while (foo) {
}

switch(foo) {
}

// Good 
if (foo) {
    // empty
}

while (foo) {
    /* empty */
}

try {
    doSomething();
} catch (ex) {
    // continue regardless of error
}