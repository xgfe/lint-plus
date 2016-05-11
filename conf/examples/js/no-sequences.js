// Bad
foo = doSomething(), val;
0, eval("doSomething();");
do {} while (doSomething(), !!test);

// Good 
foo = (doSomething(), val);
(0, eval)("doSomething();");
do {} while ((doSomething(), !!test));