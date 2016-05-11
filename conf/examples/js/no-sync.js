// Bad
fs.existsSync(somePath);
var contents = fs.readFileSync(somePath).toString();

// Good 
obj.sync();
async(function() {
    // ...
});