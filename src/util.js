/**
 * A function that returns the given variable unchanged.
 *
 * @private
 * @param   {?} x
 *          Variable to return.
 * @return  {?}
 *          Unmodified original variable.
 */
var identity = function (x) {
    return x;
};

/**
 * A simple fall-back for Array.from.
 *
 * @private
 * @param   {Object} arrayLike
 *          Array-like structure.
 * @param   {Function} [map=identity]
 *          Optional function to convert the values.
 * @param   {?} [context]
 *          Optional context for the map function.
 * @return  {Array}
 *          Array made from the iven array-like structure.
 */
var arrayFrom = Array.from || function (arrayLike, map, context) {

    if (map === undefined) {
        map = identity;
    }

    return Array.prototype.map.call(arrayLike, map, context);

};

/**
 * A simple fall-back for Object.assign.
 *
 * @private
 * @param   {Object} source
 *          Source object to modify.
 * @param   {Object} [...objects]
 *          Additional objects to extend the first.
 * @return  {Object}
 *          Extended object.
 */
var objectAssign = Object.assign || function (source) {

    Array.prototype.forEach.call(arguments, function (object, i) {

        // Skip null objects and the first one (source parameter).
        if (object && i > 0) {

            Object.keys(object).forEach(function (key) {
                source[key] = object[key];
            });

        }

    });

    return source;

};

/**
 * A function that does nothing.
 *
 * @private
 */
var noop = function () {
    return;
};

/**
 * The regular expression used to test functions for whether or not they include
 * the "$super" magic property.
 * @private
 * @type    {RegExp}
 */
var fnTest = (
    (/return/).test(noop)
    ? (/[.'"]\$super\b/)
    : (/.*/)
);

/**
 * A reference (and possible fallback) for requestAnimationFrame.
 *
 * @private
 * @function
 * @param    {Function} callback
 *           Function to execute when the animation frame ticks over.
 */
var requestAnimationFrame = (
    globalVariable.requestAnimationFrame
    || globalVariable.webkitRequestAnimationFrame
    || globalVariable.mozRequestAnimationFrame
    || function (callback) {
        globalVariable.setTimeout(callback, 1000 / 60);
    }
);

/**
 * Interprets a value so that it is a string. If the given value is null or
 * undefined, an empty string is returned.
 *
 * @private
 * @param   {?} value
 *          Value to convert into a string.
 * @return  {String}
 *          Interpretted string.
 */
var interpretString = function (value) {

    return (
        (value === "" || value === null || value === undefined)
        ? ""
        : String(value).trim()
    );

};

/**
 * Create a lower-case version of {@link interpretString}.
 *
 * @private
 * @param   {?} value
 *          Value to convert into a string.
 * @return  {String}
 *          Interpretted lower-case string.
 */
var interpretLowerString = function (value) {
    return interpretString(value).toLowerCase();
};

/**
 * Helper function for slicing array-like objects.
 *
 * @private
 * @param   {Object} arrayLike
 *          Array-like structure.
 * @param   {Number} [start]
 *          Optional start for the slice.
 * @return  {Array}
 *          Sliced array.
 */
var slice = function (arrayLike, start) {
    return Array.prototype.slice.call(arrayLike, start);
};

/**
 * Takes the arguments and converts them into a valid JSON string.
 *
 * @private
 * @return  {String}
 *          JSON string based on the given arguments.
 */
var stringifyArguments = function () {
    return JSON.stringify(slice(arguments));
};

/**
 * Checks to see if the given object has the given property.
 *
 * @private
 * @param   {Object} object
 *          Object whose property's existence should be checked.
 * @param   {String} property
 *          Name of the property to check for.
 * @return  {Boolean}
 *          true if the object has the property, false otherwise.
 */
var owns = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
};

/**
 * Removes duplicated values from the given array.
 *
 * @param  {Array} array
 *         Array to reduce.
 * @return {Array}
 *         Array containing unique values.
 */
var arrayUnique = function (array) {

    return array.reduce(function (unique, item) {

        if (unique.indexOf(item) < 0) {
            unique.push(item);
        }

        return unique;

    }, []);

};
