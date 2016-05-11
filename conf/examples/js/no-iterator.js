// Bad
Foo.prototype.__iterator__ = function() {
    return new FooIterator(this);
};
foo.__iterator__ = function () {};
foo["__iterator__"] = function () {};

// Good 
var __iterator__ = foo; // Not using the `__iterator__` property.