/**
 * Handles WAI-ARIA attributes that handle space-separated lists of IDs.
 * @class ARIA.ReferenceList
 * @extends ARIA.List
 */
ARIA.ReferenceList = ARIA.createClass(ARIA.List, {

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
        } else if (typeof value === "string" || ARIA.isNode(value)) {
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
        return this.toArray(ARIA.getById);
    },

    /**
     * Checks to see either if the attribute exists and all elements exist or,
     * if a parameter is passed, whether or not that item appears within the
     * list.
     *
     * @param  {Element|String} [item]
     *         Optional item to check for.
     * @return {Boolean}
     *         true if the attribute exists and all elements exist or, if a
     *         parameter is passed, true if the list contains the value.
     */
    has: function (item) {

        return this.hasAttribute() && (
            item === undefined
            ? this.get().filter(Boolean).length === this.length
            : this.contains(item)
        );

    }

});
