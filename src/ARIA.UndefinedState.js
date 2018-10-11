/**
 * Handles a WAI-ARIA state that can be true or false but can also be undefined.
 *
 * @class ARIA.UndefinedState
 * @extends ARIA.State
 */
ARIA.UndefinedState = ARIA.createClass(ARIA.State, /** @lends ARIA.UndefinedState.prototype */{

    /**
     * Allows for true, false or undefined.
     *
     * @inheritDoc
     */
    isValidToken: function (value) {

        return (
            value === undefined
            || value === "undefined"
            || this.$super(value)
        );

    },

    /**
     * Interprets undefined as "undefined.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Boolean|String}
     *         Either the boolean value, "undefined" or an empty string if the
     *         value is not understood.
     */
    interpret: function (value) {

        return (
            (value === undefined || value === "undefined")
            ? "undefined"
            : this.$super(value)
        );

    },

    /**
     * Returns a boolean or undefined.
     *
     * @return {Boolean|undefined}
     *         Value of the attribute.
     */
    get: function () {

        var value = this.$super();

        if (value === "undefined") {
            value = undefined;
        }

        return value;

    }

});
