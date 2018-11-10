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
     * @param      {Array.<String>} [tokens]
     *             Optional white-list of valid tokens for this property.
     */
    init: function (element, attribute, tokens) {

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

        /**
         * White-list of valid tokens. This is a reference to a property of
         * {@link ARIA.tokens} so updating that property will update all these
         * instances.
         * @type {Array.<String>}
         */
        this.tokens = (
            (tokens && Array.isArray(tokens))
            ? tokens
            : []
        );

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
     * Checks to see if the given token is valid for this current property. This
     * function checks against {@link ARIA.Property#tokens}. If the token is not
     * valid, a warning it sent. See {@link ARIA.warn}.
     *
     * @param  {String} token
     *         Token to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    isValidToken: function (token) {

        var isValid = (!this.tokens.length || this.tokens.indexOf(token) > -1);

        if (!isValid) {
            ARIA.warn(ARIA.WARNING_INVALID_TOKEN, token, this.attribute);
        }

        return isValid;

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

        if (interpretted !== "" && this.isValidToken(interpretted)) {
            ARIA.setAttribute(element, attribute, interpretted);
        } else if (interpretted === "") {
            ARIA.removeAttribute(element, attribute);
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
