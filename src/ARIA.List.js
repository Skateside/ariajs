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
     * interpretted as an array (see {@link ARIA.List#interpret}). If the values
     * are interpretted as empty array, the attribute is removed using
     * {@link ARIA.Property#remove}. Only unique values are added (see
     * {@link ARIA.arrayUnique}).
     *
     * @param {?} value
     *        Value(s) to add. If the given value is a string, it is assumed to
     *        be a space-separated list.
     * @fires ARIA.Property#preset
     * @fires ARIA.Property#postset
     */
    set: function (value) {

        var that = this;
        var values = arrayUnique(that.interpret(value));
        var eventData = {
            raw: value,
            value: values
        };
        var preEvent = this.trigger(ARIA.EVENT_PRE_SET, eventData);

        if (!preEvent.defaultPrevented) {

            that.list = values;

            if (values.length) {

                ARIA.setAttribute(
                    this.element,
                    this.attribute,
                    values.join(" ")
                );

            } else {
                this.remove();
            }

            this.trigger(ARIA.EVENT_POST_SET, eventData);

        }

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} as an array. Modifying
     * the array will not affect the attribute.
     *
     * @param  {Function} [map]
     *         Optional mapping function for converting the results.
     * @return {Array.<String>}
     *         Value of the attribute as an array.
     * @fires  ARIA.Property#preget
     * @fires  ARIA.Property#postget
     */
    get: function (map) {

        var preEvent = this.trigger(ARIA.EVENT_PRE_GET);
        var list = [];

        if (!preEvent.defaultPrevented) {

            list = arrayFrom(this.list, map);
            this.trigger(ARIA.EVENT_POST_GET, {
                value: list
            });

        }

        return list;

    }

});
