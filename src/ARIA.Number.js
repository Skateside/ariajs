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
        } else if (!isNotANumber(min) && interpretted < min) {

            ARIA.warn(ARIA.WARNING_VALUE_TOO_LOW, value, attribute, min);
            isValid = false;

        } else if (!isNotANumber(max) && interpretted > max) {

            ARIA.warn(ARIA.WARNING_VALUE_TOO_HIGH, value, attribute, max);
            isValid = false;

        }

        return isValid;

    },

    /**
     * Sets the minimum value that is considered valid.
     *
     * @param {Number|String} min
     *        Minimum value.
     */
    setMin: function (min) {

        /**
         * The minimum value that is considered valid.
         * @type {Number}
         */
        this.min = this.interpret(min);

    },

    /**
     * Sets the maximum value that is considered valid.
     *
     * @param {Number|String} max
     *        Maximum value.
     */
    setMax: function (max) {

        /**
         * The maximum value that is considered valid.
         * @type {Number}
         */
        this.max = this.interpret(max);

    }

});
