/**
 * Handles number values.
 *
 * @class ARIA.Integer
 * @extends ARIA.Property
 */
ARIA.Number = ARIA.createClass(ARIA.Property, /** @lends ARIA.Number.prototype */{

    /**
     * Interprets the value as a number. If the value can't be converted into a
     * number, NaN is returned.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Number}
     *         Number value.
     */
    interpret: function (value) {
        return parseFloat(this.$super(value));
    }

});
