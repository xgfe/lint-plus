// Bad
switch (a) {
    case 1:
        /* code */
        break;
}

// Good 
switch (a) {
    case 1:
        /* code */
        break;

    default:
        /* code */
        break;
}
