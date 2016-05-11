// Bad
if (foo) foo++;

while (bar)
    baz();

if (foo) {
    baz();
} else qux();

// Good 
if (foo) {
    foo++;
}

while (bar) {
    baz();
}

if (foo) {
    baz();
} else {
    qux();
}