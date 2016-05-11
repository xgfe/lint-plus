// Bad
foo(function(a) { return a; });
foo(function() { return this.a; }.bind(this));

// Good 
foo(a => a);
foo(function*() { yield; });