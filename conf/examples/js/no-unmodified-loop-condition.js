// Bad
while (node) {
    doSomething(node);
}
node = other;

// Good 
while (node) {
    doSomething(node);
    node = node.parent;
}