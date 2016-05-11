// Bad
var foo = {
    w: function() {},
    x: function *() {},
    [y]: function() {},
    z: z
};

// Good 
var foo = {
        x: (y) => y
};