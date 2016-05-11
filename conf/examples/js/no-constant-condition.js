// Bad
if (false) {
    doSomethingUnfinished();
}

for (;-2;) {
    doSomethingForever();
}


// Good 
if (x === 0) {
    doSomething();
}

for (;;) {
    doSomethingForever();
}