/**
 * Handles attributes and their values.
 * @class Attribute
 */
export default class Attribute {

    /**
     * @constructs Attribute
     * @param {String} attributeName
     *        Name of the attribute.
     */
    constructor(attributeName) {

        this.constructor.validateName(attributeName);

        /**
         * The name of the attribute, converted into lower-case.
         * @type {String}
         */
        this.attributeName = attributeName.toLowerCase();

    }

    /**
     * Exposes {@link Attribute#attributeName}
     * @return {String}
     *         The attribute name.
     */
    name() {
        return this.attributeName;
    }

    /**
     * Reads the attribute on the given element.
     *
     * @param  {Element} element
     *         Element whose attribute should be returned.
     * @return {String|undefined}
     *         The value of the attribute on the given element. If the element
     *         isn't provided, undefined is returned. If the attribute isn't on
     *         the given element, an empty string is returned.
     */
    read(element) {

        return (
            element
            ? (element.getAttribute(this.name()) || "")
            : undefined
        );

    }

    /**
     * Writes the attribute on the given eleent to the given value.
     *
     * @param  {Element} element
     *         Element that should have an attribute set to the given value.
     * @param  {?} value
     *         The attribute value. The value will be connverted into a String
     *         before being set.
     * @return {Boolean}
     *         true if the value was set, false if there was no element.
     */
    write(element, value) {

        if (!element) {
            return false;
        }

        element.setAttribute(this.name(), value.toString());

        return true;

    }

    /**
     * Removes the attribute from the given element.
     *
     * @param  {Element} element
     *         Element whose attribute should be removed.
     * @return {Boolean}
     *         true if the attribute was removed, false if there was no element.
     */
    clear(element) {

        if (!element) {
            return false;
        }

        element.removeAttribute(this.name());

        return true;

    }

    /**
     * Checks to see if the given element has this attribute. This function
     * doesn't check to see if the attribute has a value, merely that the
     * attribute is on the element. To check for a value, use
     * {@link Attribute#isEmpty}.
     *
     * @param  {Element} element
     *         Element whose element should be returned.
     * @return {Boolean}
     *         true if the attribute exists, false if it does not or if there is
     *         no element.
     */
    exists(element) {
        return Boolean(element) && element.hasAttribute(this.name());
    }

    /**
     * Checks to see if the given element has this attribute and that the
     * attribute has a non-empty value.
     *
     * @param  {Element} element
     *         Element whose attribute should be checked.
     * @return {Boolean}
     *         true if the attribute is empty or isn't set, false otherwise.
     */
    isEmpty(element) {
        return !this.exists(element) || this.read(element) === "";
    }

    /**
     * A cache of {@link Attribute} instances for the given attribute name.
     * @type {Object}
     */
    static cache = Object.create(null);

    /**
     * Creates an {@link Attribute} instance based on the given attribute. The
     * instances is cached so only one is created for each value.
     *
     * @param  {String} attribute
     *         Attribute name.
     * @return {Attribute}
     *         Instance of {@link Attribute}.
     */
    static create(attribute) {

        let cached = this.cache[attribute];

        if (!cached) {

            cached = new this(attribute);
            this.cache[attribute] = cached;

        }

        return cached;

    }

    /**
     * Checks to see if the given attribute name is valid and can be used as an
     * attribute name.
     *
     * @param  {?} attributeName
     *         Attribute name to validate.
     * @return {Boolean}
     *         true if the name is valid.
     * @throws {Error}
     *         Given attribute name must be valid.
     */
    static validateName(attributeName) {

        if (typeof attributeName !== "string" || (/\s/).test(attributeName)) {
            throw new Error("Invalid attribute name");
        }

        return true;

    }

}
