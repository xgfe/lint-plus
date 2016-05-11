// Bad
var foo = bar
(1 || 2).baz();
var hello = 'world'
    [1, 2, 3].forEach(addNumber);

// Good 
var foo = bar;
(1 || 2).baz();
var foo = bar
    ;(1 || 2).baz()