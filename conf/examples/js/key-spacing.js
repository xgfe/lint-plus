// Bad
/*eslint key-spacing: ["error", { "beforeColon": false }]*/
var obj = { "foo" : 42 };
/*eslint key-spacing: ["error", { "beforeColon": true }]*/
var obj = { "foo": 42 };

// Good
/*eslint key-spacing: ["error", { "beforeColon": false }]*/
var obj = { "foo": 42 };
/*eslint key-spacing: ["error", { "beforeColon": true }]*/
var obj = { "foo" : 42 };