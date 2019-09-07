import Attribute from "./Attribute.js";

class AriaAttribute extends Attribute {

    static get PREFIX() {
        return "aria-";
    }

    static validateString(name) {

        if (typeof name !== "string") {
            throw new TypeError("AriaAttribute requires a string");
        }

        return true;

    }

    static prefix(name) {

        this.validateString(name);

        let prefix = AriaAttribute.PREFIX;

        if (!name.startsWith(prefix)) {
            name = prefix + name;
        }

        return name;

    }

    static unprefix(name) {

        this.validateString(name);

        let prefix = AriaAttribute.PREFIX;

        if (name.startsWith(prefix)) {
            name = name.slice(prefix.length);
        }

        return name;

    }

    static create(name) {
        return super.create(this.prefix(name));
    }

    constructor(attributeName) {

        super(attributeName);

        let prefix = this.constructor.PREFIX;

        if (!attributeName.startsWith(prefix)) {

            throw new Error(
                "AriaAttribute constructor must be passed an attribute "
                + "starting with '" + prefix + "'"
            );

        }

    }

}
