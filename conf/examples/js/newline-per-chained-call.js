// Bad
_.chain({}).map(foo).filter(bar).value();
// Or
_.chain({}).map(foo).filter(bar);

// Good 
_
    .chain({})
    .map(foo)
    .filter(bar)
    .value();
// Or
_
    .chain({})
    .map(foo)
    .filter(bar);
