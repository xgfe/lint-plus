// Bad
var foo = undefined;
if (foo === undefined) {
    // ...
}
// Good 
var foo = void 0;
if (typeof foo === "undefined") {
    // ...
}