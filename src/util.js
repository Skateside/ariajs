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
 * A simple wrapper for Array#slice.
 *
 * @private
 * @param   {Array|Object} arrayLike
 *          Array or array-like structure to slice.
 * @param   {Number} [offset]
 *          Optional offset for the slice.
 * @return  {Array}
 *          Sliced array.
 */
var slice = function (arrayLike, offset) {
    return Array.prototype.slice.call(arrayLike, offset);
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

    slice(arguments, 1).forEach(function (object) {

        if (object) {

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

var fnTest = (
    (/return/).test(noop)
    ? (/[.'"]\$super\b/)
    : (/.*/)
);
