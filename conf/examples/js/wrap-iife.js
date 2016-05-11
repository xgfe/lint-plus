// Bad
var x = function () { return { y: 1 };}(); // unwrapped

// Good 
var x = (function () { return { y: 1 };}()); // wrapped call expression