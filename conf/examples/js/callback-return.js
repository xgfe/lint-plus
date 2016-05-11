// Bad
function foo() {
    if (err) {
        callback(err);
    }
    callback();
}

// Good 
function foo() {
    if (err) {
        return callback(err);
    }
    callback();
}