// Bad
switch(foo) {
    case 1:
        doSomething();
    case 2:
        doSomething();
}

// Good 
switch(foo) {
    case 1:
        doSomething();
        break;
    case 2:
        doSomething();
}