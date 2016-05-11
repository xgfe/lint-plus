// Bad
var foo = {
    bar: "baz",
    qux: "quux",
};

var arr = [1,2,];

foo({
    bar: "baz",
    qux: "quux",
});

// Good 
var foo = {
    bar: "baz",
    qux: "quux"
};

var arr = [1,2];

foo({
    bar: "baz",
    qux: "quux"
});