// Bad
if (a) {
    b();
}
if (a) { b(); }

// Good 
if (a) {
    b();
}
if (a)
{
    b();
}