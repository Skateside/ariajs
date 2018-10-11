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

        var that = this;

        /**
         * Element whose attribute is being handled.
         * @type {Element}
         */
        that.element = element;

        /**
         * Attribute being handled.
         * @type {String}
         */
        that.attribute = attribute;

        if (that.has()) {
            that.set(that.get());
        }

        /**
         * The value of the {@link ARIA.Property#attribute}.
         *
         * @memberof ARIA.Property
         * @instance
         * @name value
         * @type {String}
         */
        Object.defineProperty(that, "value", {

            get: function () {
                return that.toString();
            }

        });

    },

    /**
     * Sets the white-list of allowed tokens for this property.
     *
     * @param {Array.<String>} tokens
     *        White-list of tokens.
     */
    setTokens: function (tokens) {

        /**
         * White-list of valid tokens.
         * @type {Array.<String>}
         */
        this.tokens = arrayFrom(tokens);

    },

    /**
     * Sets the pattern to work out if values are valid.
     *
     * @param {RegExp} pattern
     *        Pattern for the values.
     */
    setPattern: function (pattern) {

        /**
         * Pattern that values have to match. Be aware that
         * {@link ARIA.Property#tokens} will override this pattern even if they
         * don't match.
         * @type {RegExp}
         */
        this.pattern = pattern;

    },

    /**
     * Checks to see if the given token is valid for this current property. This
     * function checks against {@link ARIA.Property#tokens} and
     * {@link ARIA.Property#pattern} if they're set.
     *
     * @param  {String} token
     *         Token to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    isValidToken: function (token) {

        var tokens = this.tokens;
        var pattern = this.pattern;
        var isValid = true;

        if (tokens && tokens.length) {
            isValid = tokens.indexOf(token) > -1;
        } else if (pattern) {
            isValid = pattern.test(token);
        }

        return isValid;

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

        return (
            (value === null || value === undefined)
            ? ""
            : String(value).trim()
        );

    },

    /**
     * Sets {@link ARIA.Property#attribute} to the given value, once
     * interpretted (see {@link ARIA.Property#interpret}) and validated (see
     * {@link ARIA.Property#isValidToken}).
     *
     * @param {?} value
     *        Value to set.
     */
    set: function (value) {

        var token = this.interpret(value);
// console.log("value = %o, token = %o, isValid = %o", value, token, this.isValidToken(token));
        if (token !== "" && this.isValidToken(token)) {
            this.setAttribute(token);
        }

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} and interprets it
     * (see {@link ARIA.Property#interpret}).
     *
     * @return {String}
     *         Interpretted value of {@link ARIA.Property#attribute}.
     */
    get: function () {
        return this.interpret(this.getAttribute());
    },

    /**
     * Checks whether or not {@link ARIA.Property#attribute} is set on
     * {@link ARIA.Property#element}.
     *
     * @return {Boolean}
     *         true if the attribute is set, false otherwise.
     */
    has: function () {
        return this.hasAttribute();
    },

    /**
     * Removes {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element}.
     */
    remove: function () {
        this.removeAttribute();
    },

    /**
     * Sets the value of {@link ARIA.Property#attribute}. This method bypasses
     * the validation and interpretation processes of {@link ARIA.Property#set}.
     * If value is empty (a falsy valid in JavaScript, but neither false nor 0)
     * then the attribute is removed.
     *
     * @param {String} value
     *        Value of the attribute to set.
     */
    setAttribute: function (value) {

        if (!this.isSetting) {

            /**
             * A flag set while the setting is taking place. Prevents infinite
             * loops caused by MutationObservers.
             * @type {Boolean}
             */
            this.isSetting = true;
            value = String(value);

            if (value !== "" || value !== undefined || value !== null) {
                this.element.setAttribute(this.attribute, value);
            } else {
                this.removeAttribute();
            }

            this.isSetting = false;

        }

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute}. THis bypasses the
     * interpretation of {@link ARIA.Property#get}.
     *
     * @return {String|null}
     *         Value of the attribute or null if the attribute is not set.
     */
    getAttribute: function () {
        return this.element.getAttribute(this.attribute);
    },

    /**
     * Checks to see if {@link ARIA.Property#element} has
     * {@link ARIA.Property#attribute}.
     *
     * @return {Boolean}
     *         true if the attribute is set, false otherwise.
     */
    hasAttribute: function () {
        return this.element.hasAttribute(this.attribute);
    },

    /**
     * Removes {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element}.
     */
    removeAttribute: function () {
        this.element.removeAttribute(this.attribute);
    },

    /**
     * Returns the value of {@link ARIA.Property#attribute} as a string. See
     * {@link ARIA.Property#get}.
     *
     * @return {String}
     *         Value of the attribute.
     */
    toString: function () {
        return this.getAttribute() || "";
    }

});
