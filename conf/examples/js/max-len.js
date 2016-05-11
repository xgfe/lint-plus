// Bad
/*eslint max-len: ["error", 80]*/
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" };

// Good 
var foo = {
    "bar": "This is a bar.",
    "baz": { "qux": "This is a qux" },
    "easier": "to read"
};