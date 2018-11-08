/**
 * Handles number values.
 *
 * @class ARIA.Integer
 * @extends ARIA.Number
 */
ARIA.Integer = ARIA.createClass(ARIA.Number, /** @lends ARIA.Integer.prototype */{

    /**
     * Interprets the value as an integer. If the value can't be converted into
     * a number, NaN is returned.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Number}
     *         Number value.
     */
    interpret: function (value) {
        return Math.floor(this.$super(value));
    }

});
