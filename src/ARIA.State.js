/**
 * Handles WAI-ARIA states.
 *
 * @class ARIA.State
 * @extends ARIA.Property
 */
ARIA.State = ARIA.createClass(ARIA.Property, /** @lends ARIA.State.prototype */{

    /**
     * Unlike the parent {@link ARIA.Property}, an instance of ARIA.State cannot
     * have tokens set.
     *
     * @constructs ARIA.State
     * @param      {Element} element
     *             Element whose attribute should be handled.
     * @param      {String} attribute
     *             Name of the attribute to handle.
     */
    init: function (element, attribute) {

        this.$super(element, attribute, [
            "true",
            "false"
        ]);

    },

    /**
     * @inheritDoc
     */
    isValidToken: function (token) {
        return typeof token === "boolean" || this.$super(token);
    },

    /**
     * Coerces the given value into a boolean.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {Boolean|String}
     *         Coerced boolean or an empty string.
     */
    interpret: function (value) {

        var interpretted = this.$super(value);
        var isTrue = interpretted === "true";

        return (
            (isTrue || interpretted === "false")
            ? isTrue
            : interpretted
        );

    }

});
