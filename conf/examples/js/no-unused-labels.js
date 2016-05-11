// Bad
A: var foo = 0;

// Good 
A: {
    if (foo()) {
        break A;
    }
    bar();
}
