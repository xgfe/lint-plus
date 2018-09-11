class Person {
    static city = 'Beijing';
    name = 'Tom';

    constructor(name) {
        this.name = name;
    }

    greeting() {
        console.log('Hello~ My name is ' + this.name);
    }
}

export { Person };