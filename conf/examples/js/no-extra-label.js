// Bad
A: while (a) {
    break A;
}

B: for (let i = 0; i < 10; ++i) {
    break B;
}

// Good 
while (a) {
    break;
}

for (let i = 0; i < 10; ++i) {
    break;
}