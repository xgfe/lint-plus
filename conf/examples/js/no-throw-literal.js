//no-throw-literal
// Bad 
throw "error";
throw 0;
throw undefined;
throw null;

// Good
throw new Error();
throw new Error("error");
var e = new Error("error");
throw e;