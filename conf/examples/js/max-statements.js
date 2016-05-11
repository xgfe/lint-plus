// Bad
function foo() {
    var foo1 = 1;
    var foo2 = 2;
    var foo3 = 3;
    var foo4 = 4;
    var foo5 = 5;
    var foo6 = 6;
    var foo7 = 7;
    var foo8 = 8;
    var foo9 = 9;
    var foo10 = 10;

    var foo11 = 11; // Too many.
}

// Good 
function foo() {
    var foo1 = 1;
    var foo2 = 2;
    var foo3 = 3;
    var foo4 = 4;
    var foo5 = 5;
    var foo6 = 6;
    var foo7 = 7;
    var foo8 = 8;
    var foo9 = 9;
    var foo10 = 10;
    return function () {

        // The number of statements in the inner function does not count toward the
        // statement maximum.

        return 42;
    };
}