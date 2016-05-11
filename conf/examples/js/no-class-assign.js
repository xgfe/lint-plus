// Bad
class A { }
A = 0;

A = 0;
class A { }

class A {
    b() {
        A = 0;
    }
}

// Good 
let A = class A { }
A = 0; // A is a variable.

let A = class {
    b() {
        A = 0; // A is a variable.
    }
}