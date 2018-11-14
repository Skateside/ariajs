/**
 * Handles basic WAI-ARIA properties.
 *
 * @class ARIA.Property
 */
ARIA.Property = ARIA.createClass(/** @lends ARIA.Property.prototype */{

    /**
     * @constructs ARIA.Property
     * @param      {Element} element
     *             Element whose attribute should be handled.
     * @param      {String} attribute
     *             Name of the attribute to handle.
     */
    init: function (element, attribute) {

        /**
         * Element whose attribute is being handled.
         * @type {Element}
         */
        this.element = element;

        /**
         * Attribute being handled.
         * @type {String}
         */
        this.attribute = attribute;

        // Things like ARIA.List work with interpretted values rather than just
        // the attribute value. If the attribute already exists, pass the value
        // to the set method to allow for that. As a bonus, this can filter out
        // invalid attribute values.
        if (ARIA.hasAttribute(element, attribute)) {
            this.set(ARIA.getAttribute(element, attribute));
        }

    },

    /**
     * Interprets the given value so it can be set.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {String}
     *         String based on the value.
     */
    interpret: function (value) {
        return ARIA.Property.interpret(value);
    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} and interprets it
     * (see {@link ARIA.Property#interpret}). If {@link ARIA.Property#element}
     * doesn't have {@link ARIA.Property#attribute} then null is returned.
     *
     * @return {String|null}
     *         Interpretted value of {@link ARIA.Property#attribute} or null if
     *         the attribute is not set.
     */
    get: function () {

        var element = this.element;
        var attribute = this.attribute;

        return (
            ARIA.hasAttribute(element, attribute)
            ? this.interpret(ARIA.getAttribute(element, attribute))
            : null
        );

    },

    /**
     * Sets {@link ARIA.Property#attribute} to the given value, once
     * interpretted (see {@link ARIA.Property#interpret}) and validated (see
     * {@link ARIA.Property#isValidToken}). If the value is interpretted as an
     * empty string, the attribute is removed.
     *
     * @param {?} value
     *        Value to set.
     */
    set: function (value) {

        var element = this.element;
        var attribute = this.attribute;
        var interpretted = this.interpret(value);

        if (interpretted === "") {
            ARIA.removeAttribute(element, attribute);
        } else {
            ARIA.setAttribute(element, attribute, interpretted);
        }

    },

    /**
     * Returns the value of {@link ARIA.Property#attribute} as a string. See
     * {@link ARIA.Property#get}.
     *
     * @return {String}
     *         Value of the attribute.
     */
    toString: function () {
        return ARIA.getAttribute(this.element, this.attribute) || "";
    }

});

/**
 * Interprets the given value so it can be set. This is used to power
 * {@link ARIA.Property#interpret} while also being exposed so other functions
 * and classes can use it.
 *
 * @param  {?} value
 *         Value to interpret.
 * @return {String}
 *         String based on the value.
 */
ARIA.Property.interpret = function (value) {

    return (
        (value === null || value === undefined)
        ? ""
        : String(value).trim()
    );

};
