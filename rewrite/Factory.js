import Mediator from "./Mediator.js";

export default class Factory {

    static get OVERRIDE() {
        return true;
    }

    static get() {

        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;

    }

    constructor() {
        this.factories = Object.create(null);
    }

    // add(name, Type, Attr = AriaAttribute, override = false) {
    add(name, Type, Attr, override = false) {

        if (!name) {
            throw new TypeError(`Invalid name '${name}'.`);
        }

        if (this.recognises(name) && override !== this.constructor.OVERRIDE) {
            throw new Error(`'${name}' factory already exists.`);
        }

        this.factories[name] = (reference) => {

            return new Mediator({
                reference,
                type: new Type(),
                attribute: new Attr(name)
            });

        };

    }

    recognises(...names) {
        return names.find((name) => Boolean(this.factories[name]));
    }

    create(name, reference) {

        let factory = this.factories[name];

        if (!factory) {
            throw new ReferenceError(`Unable to find the '${name}' factory.`);
        }

        return factory(reference);

    }

}
