// Bad
label:
    while(true) {
        // ...
    }

label:
    while(true) {
        break label;
    }

// Good 
var f = {
    label: "foo"
};

while (true) {
    break;
}