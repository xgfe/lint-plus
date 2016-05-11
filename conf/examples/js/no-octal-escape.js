// Bad
var foo = "Copyright \251";

// Good 
var foo = "Copyright \u00A9";   // unicode
var foo = "Copyright \xA9";     // hexadecimal