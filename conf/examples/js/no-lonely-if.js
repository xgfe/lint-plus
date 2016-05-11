// Bad
if (condition) {
    // ...
} else {
    if (anotherCondition) {
        // ...
    }
}

// Good 
if (condition) {
    // ...
} else if (anotherCondition) {
    // ...
}
