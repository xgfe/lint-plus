// Bad
var sum = 0,i;
for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue;
    }
    a += i;
}

// Good 
var sum = 0,i;
labeledLoop: for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue labeledLoop;
    }
    a += i;
}