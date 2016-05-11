// Bad
function foo() {
    return true;
}

// Good
"use strict";
function foo() {
    "use strict";
    return;
}