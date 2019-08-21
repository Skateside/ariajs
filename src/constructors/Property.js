import Attribute from "../Attribute.js";
import AriaElement from "../AriaElement.js";

export default class Property {

    constructor(element, attribute) {

        this.setup(element, attribute);

        if (attribute.exists()) {
            this.set(attribute.getValue());
        }

    }

    setup(element, attribute) {

        this.element = element;
        this.attribute = attribute;

        attribute.setElement(element.getValue());

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
            attribute.remove();
        } else {
            attribute.set(val);
        }

    }

    get() {
        return this.read(this.attribute.getValue());
    }

    toString() {
        return this.attribute.getValue("");
    }

}
