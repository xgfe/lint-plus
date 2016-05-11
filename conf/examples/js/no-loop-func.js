// Bad
for (var i=10; i; i--) {
    (function() { return i; })();
}

// Good 
var a = function() {};

for (var i=10; i; i--) {
    a();
}