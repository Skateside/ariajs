import AriaAttribute from "./attributes/AriaAttribute.js";
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

    addFactory(name, Type, Attr = AriaAttribute, override = false) {

        if (this.factories[name] && override !== this.constructor.OVERRIDE) {
            throw new Error(`'${name}' factory already exists.`);
        }

        this.factories[name] = (element) => {

            return new Mediator({
                element,
                type: new Type(),
                attribute: new Attr(name)
            });

        };

    }

    create(name, reference) {

        let factory = this.factories[name];

        if (!factory) {
            throw new ReferenceError(`Unable to find the '${name}' factory.`);
        }

        return factory(reference);

    }

}
