import Attribute from "./Attribute.js";

let counter = 0;

class WrappedElement {

    static defaultPrefix = "aria-element-";

    constructor(element) {
        this.element = element;
    }

    unwrap() {
        return this.element;
    }

    toString() {
        return this.identify();
    }

    identify() {

        let id = this.id;

        if (!id) {

            id = Attribute.create(this, "id");
            this.id = id;

        }

        if (!id.exists()) {
            id.set(this.generateId());
        }

        return id.getValue();

    }

    generateId(prefix = this.constructor.defaultPrefix) {

        let id;

        do {

            id = prefix + counter;
            counter += 1;

        } while (this.constructor.getById(id));

        return id;

    }

    static getById(id) {
        return document.getElementById(id);
    }

}
