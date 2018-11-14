/**
 * Handles a WAI-ARIA attribute that should be a space-separated list.
 *
 * @class ARIA.List
 * @extends ARIA.Property
 */
ARIA.List = ARIA.createClass(ARIA.Property, /** ARIA.List.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        /**
         * The list of values.
         * @type {Array.<String>}
         */
        this.list = [];

        this.$super(element, attribute);

    },

    /**
     * Coerces the values into a string and splits it at the spaces.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Array.<String>}
     *         Array of strings.
     */
    interpret: function (value) {

        var val = (
            Array.isArray(value)
            ? value.join(" ")
            : value
        );
        var string = this.$super(val);

        return (
            string.length
            ? string.split(/\s+/)
            : []
        );

    },

    /**
     * Sets the value of the list to be the given value. The values are
     * interpretted as an array (see {@link ARIA.List#interpret} and validated
     * (see {@link ARIA.List#isValidToken}); only unique values are added.
     *
     * @param {?} value
     *        Value(s) to add. If the given value is a string, it is assumed to
     *        be a space-separated list.
     */
    set: function (value) {

        var that = this;
        var values = that.interpret(value).reduce(function (unique, token) {

            if (token && unique.indexOf(token) < 0) {
                unique.push(token);
            }

            return unique;

        }, []);
        var element = that.element;
        var attribute = that.attribute;

        that.list = values;

        if (values.length) {
            ARIA.setAttribute(element, attribute, values.join(" "));
        } else {
            ARIA.removeAttribute(element, attribute);
        }

    },

    /**
     * Gets the value of the attribute as an array.
     *
     * @return {Array.<String>}
     *         Value of the attribute as an array.
     */
    get: function () {
        return this.list.concat();
    }

});
