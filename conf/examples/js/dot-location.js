// Bad
/*eslint dot-location: ["error", "object"]*/
var foo = object
    .property;
/*eslint dot-location: ["error", "property"]*/

var foo = object.
    property;

// Good
/*eslint dot-location: ["error", "object"]*/
var foo = object.
    property;
var bar = object.property;
/*eslint dot-location: ["error", "property"]*/

var foo = object
    .property;
var bar = object.property;