/**
 * A warning message for invalid tokens.
 * @type {String}
 */
ARIA.WARNING_INVALID_TOKEN = "'{0}' is not a valid token for the '{1}' attribute";

/**
 * A warning message for values that are too low.
 * @type {String}
 */
ARIA.WARNING_VALUE_TOO_LOW = "The value for the '{1}' attribute should be at least {2}, {0} given";

/**
* A warning message for values that are too high.
 * @type {String}
 */
ARIA.WARNING_VALUE_TOO_HIGH = "The value for the '{1}' attribute should be at most {2}, {0} given";

/**
 * Replaces the placeholders in the string parameter with information from the
 * info parameter. Placeholders are wrapped in brackets e.g. "{0}".
 *
 * @param  {String} string
 *         String containing placeholders.
 * @param  {Array|Object} info
 *         Info to fill the string placeholders.
 * @return {String}
 *         Populated string.
 */
ARIA.supplant = function (string, info) {

    return string.replace(/\{(\d+)\}/g, function (whole, index) {

        var arg = info[index];

        return (
            (typeof arg === "string" || typeof arg === "number")
            ? arg
            : whole
        );

    });

};

/**
 * A flag to enable warnings.
 * @type {Boolean}
 */
ARIA.enableWarnings = true;

/**
 * Sends a warning.
 *
 * @param {String} message
 *        Message (and placeholders).
 * @param {Number|String} ...arguments
 *        Information to populate the message.
 */
ARIA.warn = function (message) {

    if (ARIA.enableWarnings) {
        console.warn("aria.js: " + ARIA.supplant(message, slice(arguments, 1)));
    }

};
