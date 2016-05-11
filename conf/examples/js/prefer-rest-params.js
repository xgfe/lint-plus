// Bad
function foo() {
    console.log(arguments);
}

// Good 
function foo(...args) {
    console.log(args);
}