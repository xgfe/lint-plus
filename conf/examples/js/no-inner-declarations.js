// Bad
if (test) {
    function doSomething() { }
}

function doSomethingElse() {
    if (test) {
        function doAnotherThing() { }
    }
}

// Good 
function doSomething() { }

function doSomethingElse() {
    function doAnotherThing() { }
}