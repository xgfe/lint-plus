// Bad
if(process.env.NODE_ENV === "development") {
    //...
}

// Good 
var config = require("./config");
if(config.env === "development") {
    //...
}