export default class Attribute {

    constructor(raw) {
        this.raw = raw;
    }

    name() {
        return this.raw;
    }

    refer(reference) {
        this.reference = reference;
    }

    read() {

        let element = this.reference.element();

        return (
            element
            ? element.getAttribute(this.name())
            : undefined
        );

    }

    write(value) {

        let element = this.reference.element();

        if (!element) {
            return false;
        }

        element.setAttribute(this.name(), value.toString());

        return true;

    }

    clear() {

        let element = this.reference.element();

        if (!element) {
            return false;
        }

        element.removeAttribute(this.name());

        return true;

    }

    exists() {

        let element = this.reference.element();

        return Boolean(element) && element.hasAttribute(this.name());

    }

    static create(reference, attribute) {

        let attr = new this(attribute);

        attr.refer(Reference.interpret(reference));

        return attr;

    }

}
