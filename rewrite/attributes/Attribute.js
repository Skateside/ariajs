export default class Attribute {

    constructor(attributeName) {

        if (typeof attributeName !== "string" || (/\s/).test(attributeName)) {
            throw new Error("Invalid attribute name");
        }

        this.attributeName = attributeName.toLowerCase();

    }

    name() {
        return this.attributeName;
    }

    read(element) {

        return (
            element
            ? element.getAttribute(this.name())
            : undefined
        );

    }

    write(element, value) {

        if (!element) {
            return false;
        }

        element.setAttribute(this.name(), value.toString());

        return true;

    }

    clear(element) {

        if (!element) {
            return false;
        }

        element.removeAttribute(this.name());

        return true;

    }

    exists(element) {
        return Boolean(element) && element.hasAttribute(this.name());
    }

    isEmpty(element) {
        return this.exists(element) && this.read(element) !== "";
    }

    static cache = Object.create(null);

    static create(attribute) {

        let cached = this.cache[attribute];

        if (!cached) {

            cached = new this(attribute);
            this.cache[attribute] = cached;

        }

        return cached;

    }

}
