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
    },

    /**
     * @inheritDoc
     */
    isValidToken: function (value) {

        var interpretted = this.interpret(value);
        var isValid = !isNotANumber(interpretted);
        var attribute = this.attribute;
        var min = this.min;
        var max = this.max;

        if (!isValid) {
            ARIA.warn(ARIA.WARNING_INVALID_TOKEN, value, attribute);
        }

        return isValid;

    }

});
