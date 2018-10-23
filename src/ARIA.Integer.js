/**
 * Handles integer values.
 *
 * @class ARIA.Integer
 * @extends ARIA.Property
 */
ARIA.Integer = ARIA.createClass(ARIA.Property, {

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        this.$super(element, attribute);
        this.setPattern(/^\d+$/);

    },

    /**
     * Interprets the value as an integer, discarding the decimal place. If the
     * value can't be converted into a number, NaN is returned.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Number}
     *         Integer value.
     */
    interpret: function (value) {

        var interpretted = this.$super(value);

        return (
            interpretted === ""
            ? NaN
            : Math.floor(interpretted)
        );

    }

});
