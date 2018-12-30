/**
 * Handles WAI-ARIA attributes that handle space-separated lists of IDs.
 * @class ARIA.ReferenceList
 * @extends ARIA.List
 */
ARIA.ReferenceList = ARIA.createClass(ARIA.List, /** @lends ARIA.ReferenceList.prototype */{

    /**
     * Interprets an element, ID or array of elements or/and IDs as an array of
     * element IDs.
     *
     * @param  {Array.<Element|String>|Element|String} value
     *         Value(s) to interpret.
     * @return {Array.<String>}
     *         Collection of IDs.
     */
    interpret: function (value) {

        var interpretted = [];

        if (
            value
            && typeof value === "object"
            && typeof value.length === "number"
        ) {
            interpretted = arrayFrom(value, ARIA.Reference.interpret, this);
        } else if (typeof value === "string") {
            interpretted = this.$super(value);
        } else {
            interpretted = [ARIA.Reference.interpret(value)];
        }

        // Remove all falsy values such as "" or null.
        return interpretted.filter(Boolean);

    },

    /**
     * Gets an array of elements referenced by the attribute. If the element
     * cannot be found, null will be in place of the element.
     *
     * @return {Array.<Element|null>}
     *         Array of elements.
     */
    get: function () {
        return this.$super(ARIA.getById);
    }

});
