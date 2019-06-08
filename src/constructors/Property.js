import {
    prefix,
    translate
} from "../util.js";

export default class Property {

    constructor(...args) {

        this.setup(...args);

        let {
            element,
            attribute
        } = this;

        if (Property.hasAttribute(element, attribute)) {
            this.set(Property.getAttribute(element, attribute));
        }

    }

    setup(element, attribute) {

        this.element = element;
        this.attribute = translate(prefix(attribute));

    }

    write(value) {
        return value;
    }

    read(value) {
        return value;
    }

    set(value) {

        let {
            element,
            attribute
        } = this;
        let val = this.write(value);

        if (val === "") {
            Property.removeAttribute(element, attribute);
        } else {
            Property.setAttribute(element, attribute, val);
        }

    }

    get() {
        return this.read(Property.getAttribute(this.element, this.attribute));
    }

    static setAttribute(element, attribute, value) {
        element.setAttribute(attribute, value);
    }

    static getAttribute(element, attribute) {

        return (
            Property.hasAttribute(element, attribute)
            ? element.getAttribute(attribute)
            : null
        );

    }

    static hasAttribute(element, attribute) {
        return element.hasAttribute(attribute);
    }

    static removeAttribute(element, attribute) {
        element.removeAttribute(attribute);
    }

    toString() {
        return Property.getAttribute(this.element, this.attribute) || "";
    }

}
