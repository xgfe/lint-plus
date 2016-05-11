// Bad
function bar() { return /=foo/; }

// Good 
function bar() { return /\=foo/; }