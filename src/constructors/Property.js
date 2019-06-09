import {
    prefix,
    translate
} from "../util.js";
import AriaElement from "../AriaElement.js";

export default class Property {

    constructor(...args) {

        this.setup(...args);

        let {
            element,
            attribute
        } = this;

        if (AriaElement.hasAttribute(element, attribute)) {
            this.set(AriaElement.getAttribute(element, attribute));
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
            AriaElement.removeAttribute(element, attribute);
        } else {
            AriaElement.setAttribute(element, attribute, val);
        }

    }

    get() {
        return this.read(AriaElement.getAttribute(this.element, this.attribute));
    }

    toString() {
        return AriaElement.getAttribute(this.element, this.attribute) || "";
    }

}
