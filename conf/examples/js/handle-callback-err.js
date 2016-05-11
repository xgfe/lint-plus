// Bad
function loadData (err, data) {
    doSomething();
}

// Good 
function loadData (err, data) {
    if (err) {
        console.log(err.stack);
    }
    doSomething();
}

function generateError (err) {
    if (err) {}
}