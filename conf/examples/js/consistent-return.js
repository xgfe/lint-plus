// Bad
function doSomething(condition) {

    if (condition) {
        return true;
    } else {
        return;
    }
}

// Good 
function doSomething(condition) {

    if (condition) {
        return true;
    } else {
        return false;
    }
}