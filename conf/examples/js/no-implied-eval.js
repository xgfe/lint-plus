// Bad
setTimeout("alert('Hi!');", 100);
setInterval("alert('Hi!');", 100);
execScript("alert('Hi!')");

// Good 
setTimeout(function() {
    alert("Hi!");
}, 100);

setInterval(function() {
    alert("Hi!");
}, 100);