// Bad
x = y;
x += y;
x = y * z;

// Good 
x = x + y;
x = y * x;
x[0] = x[0] / y;