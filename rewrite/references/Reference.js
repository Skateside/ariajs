import Attribute from "../attributes/Attribute.js";

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

        let {
            id,
            reference
        } = this;

        if (!reference) {
            return;
        }

        if (!id) {

            id = Attribute.create("id");
            this.id = id;

        }

        if (!id.exists(reference)) {
            id.write(reference, this.constructor.generateId());
        }

        return id.read(reference);

    }

    static generateId(prefix = this.defaultPrefix) {

        let id;

        do {
            id = `${prefix}${this.counter++}`;
        } while (this.lookup(id));

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

    static isReference(object) {
        return object instanceof this;
    }

}
