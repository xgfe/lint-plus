// Bad
var foo = /^abc[]/;
/^abc[]/.test(foo);
bar.match(/^abc[]/);

// Good 
var foo = /^abc/;
var foo = /^abc[a-z]/;
var bar = new RegExp("^abc[]");