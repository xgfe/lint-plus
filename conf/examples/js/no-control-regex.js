// Bad
var pattern1 = /\x1f/;
var pattern2 = new RegExp("\x1f");

// Good 
var pattern1 = /\x20/;
var pattern2 = new RegExp("\x20");
