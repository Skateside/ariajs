import Attribute from "./Attribute.js";

export default class Reference {

    static defaultPrefix = "aria-element-";
    static counter = 0;

    constructor(element) {
        this.reference = element;
    }

    element() {
        return this.reference;
    }

    toString() {
        return this.identify();
    }

    identify() {

        if (!this.reference) {
            return undefined;
        }

        let id = this.id;

        if (!id) {

            id = Attribute.create(this, "id");
            this.id = id;

        }

        if (!id.exists()) {
            id.write(this.generateId());
        }

        return id.read();

    }

    generateId(prefix = this.constructor.defaultPrefix) {

        let id;

        do {
            id = `${prefix}${this.constructor.counter++}`;
        } while (this.constructor.lookup(id));

        return id;

    }

    static lookup(id) {
        return document.getElementById(id);
    }

    static interpret(value) {

        let reference = null;

        if (value instanceof Element) {
            reference = value;
        }

        if (typeof value === "string") {
            reference = this.lookup(value);
        }

        return new this(reference);

    }

}
