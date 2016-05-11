// Bad
a = (b * c);
(a * b) + c;
typeof (a);
(function(){} ? a() : b());

// Good 
(0).toString();
({}.toString.call());
(function(){}) ? a() : b();
(/^a$/).test(x);