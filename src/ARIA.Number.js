/**
 * Handles number values.
 *
 * @class ARIA.Integer
 * @extends ARIA.Property
 */
ARIA.Number = ARIA.createClass(ARIA.Property, {

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        this.$super(element, attribute);
        this.setPattern(/^(\d+(\.\d+)?)|\.\d+$/);

    },

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

        var interpretted = this.$super(value);

        return (
            interpretted === ""
            ? NaN
            : parseFloat(interpretted)
        );

    }

});
