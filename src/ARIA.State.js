/**
 * Handles WAI-ARIA states.
 *
 * @class ARIA.State
 * @extends ARIA.Property
 */
ARIA.State = ARIA.createClass(ARIA.Property, {

    /**
     * Ensures that the given value is either a boolean or a string of "true" or
     * "false". {@link ARIA.Property#tokens} and {@link ARIA.Property#pattern}
     * are ignored.
     *
     * @param  {?} value
     *         Value to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    isValidToken: function (value) {

        return (
            typeof value === "boolean"
            || value === "true"
            || value === "false"
        );

    },

    /**
     * Coerces the given value into a boolean.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {Boolean|String}
     *         Coerced boolean or an empty string.
     */
    interpret: function (value) {

        return (
            typeof value === "boolean"
            ? value === true
            : (
                (value === "true" || value === "false")
                ? value === "true"
                : ""
            )
        )

    }

});
