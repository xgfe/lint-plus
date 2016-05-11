// Bad
function foo() {
    return true;
    console.log("done");
}

// Good 
function foo() {
    return bar();
    function bar() {
        return 1;
    }
}
