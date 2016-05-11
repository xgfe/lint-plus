// Bad
{}

if (foo) {
    bar();
    {
        baz();
    }
}

// Good 
while (foo) {
    bar();
}

if (foo) {
    if (bar) {
        baz();
    }
}