// Bad
"use strict";
this.a = 0;
baz(() => this);

(function() {
    this.a = 0;
    baz(() => this);
})();

// Good 
"use strict";
function Foo() {
    // OK, this is in a legacy style constructor.
    this.a = 0;
    baz(() => this);
}
