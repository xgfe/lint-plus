// Bad
function foo() {return true;}
if (foo) { bar = 0;}

// Good 
function foo() { return true; }
if (foo) { bar = 0; }