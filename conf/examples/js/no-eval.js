// Bad
var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);

var foo = eval;
foo("var a = 0");
// Good 
var obj = { x: "foo" },
    key = "x",
    value = obj[key];