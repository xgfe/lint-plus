// Bad

if (a){
    b();
}

function a(){}

// Good 
if (a) {
    b();
} else{ /*no error. this is checked by `keyword-spacing` rule.*/
    c();
}