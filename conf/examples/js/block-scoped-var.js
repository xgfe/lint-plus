// Bad
function doIf() {
    var build;
    if (true) {
        build = true;
    }
    console.log(build);
}
function doIfElse(bool) {
    var build;

    if (bool === 1) {
        build = true;
    } else {
        build = false;
    }
}

// Good 
function doIfElse(bool) {
    var build;
    build = bool === 1;
}