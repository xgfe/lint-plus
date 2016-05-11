// Bad
function foo() {

    return;
}

function foo(bar) {
    if (!bar) {

        return;
    }
}

// Good 
function foo() {
    return;
}

function foo(bar) {
    if (!bar) return;
}

function foo(bar) {
    if (!bar) { return };
}
