import {
    prefix,
    unprefix,
    translate
} from "./util.js";

export default class Attribute {

    static prefix = "aria-";

    constructor(rawAttribute) {
        this.rawAttribute = rawAttribute;
    }

    coerce() {

        let {
            rawAttribute
        } = this;

        if (
            rawAttribute === ""
            || rawAttribute === null
            || rawAttribute === undefined
        ) {
            return "";
        }

        return String(rawAttribute).trim();

    }

    getPrefixed() {

        if (typeof this.prefixed === "string") {
            return this.prefixed;
        }

        let value = this.coerce().toLowerCase();
        let prefix = this.constructor.prefix;

        if (!value.startsWith(prefix)) {
            value = prefix + value;
        }

        this.prefixed = value;

        return this.prefixed;

    }

    getUnprefixed() {

        if (typeof this.unprefixed === "string") {
            return this.unprefixed;
        }

        let value = this.coerce().toLowerCase();
        let prefix = this.constructor.prefix;

        if (value.startsWith(prefix)) {
            value = value.substr(prefix.length);
        }

        this.unprefixed = value;

        return this.unprefixed;

    }

    setElement(element) {
        this.element = element;
    }

    set(value) {
        this.element.setAttribute(this.getPrefixed(), value);
    }

    getValue(defaultValue = "") {

        return (
            this.exists()
            ? this.element.getAttribute(this.getPrefixed())
            defaultValue
        );

    }

    exists() {
        return this.element.hasAttribute(this.getPrefixed());
    }

    clear() {
        this.element.removeAttribute(this.getPrefixed());
    }

    static create(element, attribute) {

        let attr = new this(attribute);

        attr.setElement(element.unwrap());

        return attr;

    }

}
