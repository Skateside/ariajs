/**
 * A warning message for invalid tokens.
 * @type {String}
 */
ARIA.WARNING_INVALID_TOKEN = "'{0}' is not a valid token for the '{1}' attribute";

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

    })

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
