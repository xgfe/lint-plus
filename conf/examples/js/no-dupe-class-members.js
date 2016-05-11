// Bad
class Foo {
    bar() { }
    bar() { }
}

class Foo {
    bar() { }
    get bar() { }
}

// Good 
class Foo {
    bar() { }
    qux() { }
}

class Foo {
    get bar() { }
    set bar(value) { }
}