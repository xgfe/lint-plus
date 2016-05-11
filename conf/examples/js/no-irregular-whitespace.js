// Bad
function thing() /*<NBSP>*/{
    return 'test';
}

function thing( /*<NBSP>*/){
    return 'test';
}

// Good 
function thing() {
    return ' <NBSP>thing';
}

function thing() {
    return '​<ZWSP>thing';
}