// Bad
function a() {
    return /foo/.test("bar");
}

// Good 
function a() {
    return (/foo/).test("bar");
}