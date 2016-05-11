// Bad
var x = foo;
function bar() {
    x:
        for (;;) {
            break x;
        }
}

// Good 
function foo() {
    var q = t;
}

function bar() {
    q:
        for(;;) {
            break q;
        }
}