// Bad
var err = "x";
try {
    throw "problem";
} catch (err) {

}
console.log(err)    // err is 'problem', not 'x'

// Good 
var err = "x";

try {
    throw "problem";
} catch (e) {

}
