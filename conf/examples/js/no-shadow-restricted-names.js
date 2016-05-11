// Bad
function NaN(){}
!function(Infinity){};
var undefined;
try {} catch(eval){}

// Good 
var Object;
function f(a, b){}