// Bad
class A extends B {
    constructor() {
        this.a = 0;
        super();
    }
}

// Good 
class A {
    constructor() {
        this.a = 0; // OK, this class doesn't have an `extends` clause.
    }
}