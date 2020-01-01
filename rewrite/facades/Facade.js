/**
 * A simple facade that only exposes certain methods.
 * @class Facade
 */
export default class Facade {

    /**
     * @constructs Facade
     * @param      {Object} source
     *             Class whose methods should be hidden.
     * @param      {String[]} methods
     *             Method names that should be exposed.
     */
    constructor(source, methods) {

        methods.forEach((method) => {
            this[method] = (...args) => source[method](...args);
        });

    }

}
