class Facade {

    constructor(source, methods) {

        methods.forEach((method) => {
            this[method] = (...args) => source[method](...args);
        });

    }

}
