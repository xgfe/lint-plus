// Bad
var foo = 1
    ,
    bar = 2;

var foo = 1
    , bar = 2;

var foo = ["apples"
    , "oranges"];

function bar() {
    return {
        "a": 1
        ,"b:": 2
    };
}
// Good
var foo = 1, bar = 2;

var foo = 1,
    bar = 2;

var foo = ["apples",
    "oranges"];

function bar() {
    return {
        "a": 1,
        "b:": 2
    };
}
