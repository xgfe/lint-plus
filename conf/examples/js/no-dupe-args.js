// Bad
function foo(a, b, a) {
    console.log("which a is it?", a);
}

var bar = function (a, b, a) {
    console.log("which a is it?", a);
};

// Good 
function foo(a, b, c) {
    console.log(a, b, c);
}

var bar = function (a, b, c) {
    console.log(a, b, c);
};