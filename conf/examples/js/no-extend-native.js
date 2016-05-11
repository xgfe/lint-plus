// Bad
Object.prototype.a = "a";
Object.defineProperty(Array.prototype, "times", { value: 999 });
