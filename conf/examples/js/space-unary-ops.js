// Bad
typeof!foo;
void{foo:0};
new[foo][0];

// Good
function *foo() {
    yield(0)
}