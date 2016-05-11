// Bad
var foo = new Symbol('foo');

// Good 
var foo = Symbol('foo');
// Ignores shadowed Symbol.
function bar(Symbol) {
    const baz = new Symbol("baz");
}