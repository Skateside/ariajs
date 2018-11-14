/**
 * @namespace
 */
var ARIA = {};

/**
 * The version of the library.
 *
 * @memberof ARIA
 * @type {String}
 * @constant
 * @name VERSION
 */
Object.defineProperty(ARIA, "VERSION", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: "<%= version %>"
});

var previousAria = globalVariable.ARIA;
globalVariable.ARIA = ARIA;

/**
 * Returns the previous value of the global ARIA variable.
 *
 * @return {?}
 *         Previous ARIA value.
 */
ARIA.getPrevious = function () {
    return previousAria;
};

/**
 * Removes the value of {@link ARIA} from the global variable and sets it back
 * to the previous value. This version of {@link ARIA} is returned.
 *
 * @return {Object}
 *         Current version of {@link ARIA}.
 */
ARIA.restorePrevious = function () {

    globalVariable.ARIA = previousAria;

    return ARIA;

};
