// Bad
var thing = foo ? bar : baz === qux ? quxx : foobar;
foo ? baz === qux ? quxx() : foobar() : bar();

// Good 
var thing;

if (foo) {
    thing = bar;
} else if (baz === qux) {
    thing = quxx;
} else {
    thing = foobar;
}