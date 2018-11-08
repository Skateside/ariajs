/**
 * Handles WAI-ARIA tristates. That is, a state that can be either true, false
 * or "mixed".
 *
 * @class ARIA.Tristate
 * @extends ARIA.State
 */
ARIA.Tristate = ARIA.createClass(ARIA.State, /** @lends ARIA.Tristate.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        this.$super(element, attribute);
        this.tokens.push("mixed");

    },

    /**
     * Allows the token "mixed".
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Boolean|String}
     *         Either the boolean value, "mixed" or an empty string if the value
     *         is not understood.
     */
    interpret: function (value) {

        return (
            value === "mixed"
            ? value
            : this.$super(value)
        );

    }

});
