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

    /**
     * @constructs Reference
     * @param      {Element} element
     *             Wapped element.
     */
    constructor(element) {

        /**
         * The wrapped element.
         * @type {[type]}
         */
        this.reference = element;

    }

    /**
     * Exposes {@link Reference#reference}.
     *
     * @return {Element}
     *         Wrapped element.
     */
    element() {
        return this.reference;
    }

    /**
     * When coercing into a string, the ID of {@link Reference#reference} is
     * returned.
     *
     * @return {String}
     *         ID of the wrapped element.
     */
    toString() {
        return this.identify();
    }

    /**
     * Returns the ID of {@link Reference#reference}. If it doesn't have an ID,
     * one is generated using {@link Reference.generateId}.
     *
     * @return {String}
     *         ID of the wrapped element.
     */
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

            /**
             * {@link Attribute} instance for the "id" attribute.
             * @type {Attribute}
             */
            this.id = id;

        }

        if (!id.exists(reference)) {
            id.write(reference, this.constructor.generateId());
        }

        return id.read(reference);

    }

    /**
     * Generates a unique ID. The ID will not exist on the page yet. The ID will
     * be the given prefix and {@link Reference.counter} concatenated.
     *
     * @param  {String} [prefix=Reference.defaultPrefix]
     *         The prefix for the ID.
     * @return {String}
     *         Unique ID.
     */
    static generateId(prefix = this.defaultPrefix) {

        let id;

        do {
            id = `${prefix}${this.counter++}`;
        } while (this.lookup(id));

        return id;

    }

    /**
     * Looks up an element based on the given ID.
     *
     * @param  {String} id
     *         ID of the element to find.
     * @return {Element|null}
     *         Either the element or null if no element can be found.
     */
    static lookup(id) {
        return document.getElementById(id);
    }

    /**
     * Converts the given value into a {@link Reference}. Instances are cached
     * so the same value will always be interpretted as the same instance even
     * if the values themselves are different (i.e. the element or the element's
     * ID).
     *
     * @param  {?} value
     *         Value to be interpretted.
     * @return {Reference}
     *         Generated Reference instance.
     */
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

        // null cannot be the key for a WeakMap so return a null version early.
        if (!reference) {
            return this.makeNull();
        }

        return this.makeCached(reference);

    }

    /**
     * Returns a version of {@link Reference} that contains null.
     *
     * @return {Reference}
     *         Null Reference.
     */
    static makeNull() {

        if (!this.nullObject) {

            /**
             * Null version of {@link Reference}.
             * @type {Reference}
             */
            this.nullObject = new this(null);

        }

        return this.nullObject;

    }

    /**
     * Retrieves the cached version of {@link Reference} for the given
     * reference. If the cache does not contain the given reference, the
     * instance is created and cached before being returned.
     *
     * @param  {Element} reference
     *         Element whose Reference should be returned.
     * @return {Reference}
     *         The Reference instance for the given reference.
     */
    static makeCached(reference) {

        let cache = this.cache;

        if (cache.has(reference)) {
            return cache.get(reference);
        }

        let instance = new this(reference);

        cache.set(reference, instance);

        return instance;

    }

    /**
     * Checks to see if the given object is an instance of {@link Reference}.
     *
     * @param  {Object} object
     *         Object to test.
     * @return {Boolean}
     *         true if the given object is an instance of {@link Reference}.
     */
    static isReference(object) {
        return object instanceof this;
    }

}
