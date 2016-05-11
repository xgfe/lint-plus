// Bad
if (a) {
  b=c;
  function foo(d) {
    e=f;
  }
}

// Good 
if (a) {
    b=c;
    function foo(d) {
        e=f;
    }
}