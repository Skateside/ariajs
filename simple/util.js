/**
 * A wrpper for Array.from() that's supposed to simulate ES6's array spread
 * operator.
 *
 * @private
 * @param   {Object} arrayLike
 *          Array-like structure.
 * @return  {Array}
 *          Array from the array-like structure.
 */
function spread(arrayLike) {
    return Array.from(arrayLike);
}

/**
 * A wrapper for Object.assign() which extends the given object.
 *
 * @private
 * @param   {Object} object
 *          The base object to extend.
 * @param   {...Object} arguments
 *          Objects that will extend the base object.
 * @return  {Object}
 *          Extended base object.
 */
function assign(object) {
    return Object.assign.apply(Object, [object].concat(spread(arguments)));
}

/**
 * A version of {@link assign} which clones base before extending it, so that
 * the base object isn't modified.
 *
 * @private
 * @param   {Object} base
 *          Base object to extend.
 * @param   {Object} object
 *          Object that will extend the base.
 * @return  {Object}
 *          New object, based on the base and object.
 */
function extend(base, object) {
    return assign({}, base, object);
}

/**
 * Interprets the given value as a string. null and undefined are interpretted
 * as an empty string.
 *
 * @private
 * @param   {?} value
 *          Value to interpret as a string.
 * @return  {String}
 *          String from the value.
 */
function interpretString(value) {

    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    return String(value);

}
