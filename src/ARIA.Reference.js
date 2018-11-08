/**
 * Handles WAI-ARIA attributes that reference a single ID.
 *
 * @class ARIA.Reference
 * @extends ARIA.Property
 */
ARIA.Reference = ARIA.createClass(ARIA.Property, /** @lends ARIA.Reference.prototype */{

    /**
     * Interprets the given value as a string. If the value is an element, the
     * element's ID is returned, generating one if necessary - see
     * {@link ARIA.identify}.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {String}
     *         The interpretted value.
     */
    interpret: function (value) {
        return ARIA.Reference.interpret(value);
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
        return ARIA.getById(this.$super());
    }

});

/**
 * Interprets the given value as a string. If the value is an element, the
 * element's ID is returned, generating one if necessary = see
 * {@link ARIA.identify}. This powers {@link ARIA.Reference#interpret} while
 * also allowing other functions and classes to use it.
 *
 * @param  {?} value
 *         Value to interpret.
 * @return {String}
 *         The interpretted value.
 */
ARIA.Reference.interpret = function (value) {

    return (
        ARIA.isNode(value)
        ? ARIA.identify(value)
        : ARIA.Property.interpret(value)
    );

};
