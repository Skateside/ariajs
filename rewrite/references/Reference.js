import Attribute from "~/attributes/Attribute.js";

/**
 * Wraps elements to add additional functionality as needed.
 * @class Reference
 */
export default class Reference {

    /**
     * The default prefixed used when an ID is generated for the element.
     * @type {String}
     */
    static defaultPrefix = "aria-element-";

    /**
     * The counter for the generated IDs.
     * @type {Number}
     */
    static counter = 0;

    /**
     * A cache of elements to {@link Reference} instances so that a reference
     * will always return the same instance.
     * @type {WeakMap}
     */
    static cache = new WeakMap();

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

        if (this.isReference(value)) {
            return value;
        }

        if (value instanceof Element) {
            reference = value;
        }

        if (typeof value === "string") {
            reference = this.lookup(value);
        }

        if (!reference) {
            return this.makeNull();
        }

        return this.makeCached(reference);

    }

    static makeNull() {

        if (!this.nullObject) {
            this.nullObject = new this(null);
        }

        return this.nullObject;

    }

    static makeCached(reference) {

        let cache = this.cache;

        if (cache.has(reference)) {
            return cache.get(reference);
        }

        let instance = new this(reference);

        cache.set(reference, instance);

        return instance;

    }

    static isReference(object) {
        return object instanceof this;
    }

}
