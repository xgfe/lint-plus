//no-bitwise
// Bad 
var x = y | z;
var x = y & z;
var x = y ^ z;
var x = ~ z;
var x = y << z;
var x = y >> z;
var x = y >>> z;

// Good 
var x = y || z;
var x = y && z;
var x = y > z;
var x = y < z;