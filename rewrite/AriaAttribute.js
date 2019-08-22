import Attribute from "./Attribute.js";

class AriaAttribute extends Attribute {

    static get RAW() {
        return "raw";
    }

    static get PREFIXED() {
        return "prefixed";
    }

    static get UNPREFIXED() {
        return "unprefixed";
    }

    static prefix = "aria-";

    constructor(raw) {

        super(raw);
        this.nameCache = Object.create(null);

    }

    name(mode = this.constructor.PREFIXED) {

        let {
            nameCache
        } = this;

        if (nameCache[mode]) {
            return nameCache[mode];
        }

        let method = `create_${mode}`;

        if (!this[method]) {
            throw new Error(`Unrecognised name mode '${mode}'`);
        }

        nameCache[mode] = this[method]();

        return nameCache[mode];

    }

    coerce(raw) {

        if (
            raw === ""
            || raw === null
            || raw === undefined
        ) {
            return "";
        }

        return String(raw).trim().toLowerCase();

    }

    create_raw() {
        return this.coerce(this.raw);
    }

    create_prefixed() {

        let name = this.coerce(this.raw);
        let prefix = this.constructor.prefix;

        if (!name.startsWith(prefix)) {
            name = `${prefix}${name}`;
        }

        return name;

    }

    create_unprefixed() {

        let name = this.coerce(this.raw);
        let prefix = this.constructor.prefix;

        if (name.startsWith(prefix)) {
            name = name.substr(prefix.length);
        }

        return name;

    }

}
