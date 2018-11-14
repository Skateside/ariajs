/**
 * Handles WAI-ARIA states.
 *
 * @class ARIA.State
 * @extends ARIA.Property
 */
ARIA.State = ARIA.createClass(ARIA.Property, /** @lends ARIA.State.prototype */{

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
console.log("ARIA.State#interpret(%o), interpretted = %o, returning %o", value, interpretted, (isTrue || interpretted === "false") ? isTrue : interpretted);
        return (
            (isTrue || interpretted === "false")
            ? isTrue
            : interpretted
        );

    }

});
