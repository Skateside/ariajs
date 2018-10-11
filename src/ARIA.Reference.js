/**
 * Handles WAI-ARIA attributes that reference a single ID.
 *
 * @class ARIA.Reference
 * @extends ARIA.Property
 */
ARIA.Reference = ARIA.createClass(ARIA.Property, /** @lends ARIA.Reference.prototype */{

    /**
     * Interprets the given value as a string. If the value is an element, the
     * element's ID is returned, generating one if necessary = see
     * {@link ARIA.identify}.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {String}
     *         The interpretted value.
     */
    interpret: function (value) {

        return (
            ARIA.isNode(value)
            ? ARIA.identify(value)
            : this.$super(value)
        );

    },

    /**
     * Gets the element referenced by this attribute. If the element cannot be
     * found or the attribute isn't set, null is returned.
     *
     * @return {Element|null}
     *         Element referenced by this attribute or null if the element
     *         cannot be found or the attribute isn't set.
     */
    get: function () {
        return ARIA.getById(this.getAttribute());
    },

    /**
     * Checks to see if attribute is set and the element referenced by the
     * attribute exists, returning true if both are true.
     *
     * @return {Boolean}
     *         true if the attribute exists and references an existing element,
     *         false otherwise.
     */
    has: function () {
        return this.hasAttribute() && this.get() !== null;
    }

});
