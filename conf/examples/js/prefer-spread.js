//prefer-spread
// Bad 
foo.apply(undefined, args);
foo.apply(null, args);
obj.foo.apply(obj, args);

// Good 
// The `this` binding is different.
foo.apply(obj, args);
obj.foo.apply(null, args);
obj.foo.apply(otherObj, args);