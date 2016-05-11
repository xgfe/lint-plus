// Bad
function foo()
{
    return true;
}


try
{
    somethingRisky();
} catch(e)
{
    handleError();
}

if (foo) {
    bar();
}
else {
    baz();
}

// Good 
function foo() {
    return true;
}


if (foo) {
    bar();
} else {
    baz();
}

try {
    somethingRisky();
} catch(e) {
    handleError();
}
