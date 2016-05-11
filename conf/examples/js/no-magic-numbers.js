// Bad
var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * 0.25);

// Good 
var TAX = 0.25;
var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX);