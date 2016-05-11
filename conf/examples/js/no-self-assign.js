// Bad
foo = foo;
[a, b] = [a, b];
[a, ...b] = [x, ...b];

// Good
foo = bar;
[a, b] = [b, a];