/**
 * Generates a random integer between start and end.
 *
 * @param  {Number} [start=0]
 *         Minimum value.
 * @param  {Number} end
 *         Maximum value.
 * @return {Number}
 *         Random number.
 */
function rnd(start, end) {

    if (end === undefined) {

        end = start;
        start = 0;

    }

    return Math.floor(Math.random() * end) + start;

}

/**
 * Generates a unique string - used for testing against IDs.
 *
 * @return {String}
 *         Random string.
 */
function makeUniqueId() {
    return "id-" + rnd(Date.now());
}

/**
 * Gets a string snap-shot of an element.
 *
 * @param  {Element} element
 *         Element to stringify.
 * @return {String}
 *         Stringified element.
 */
function stringifyElement(element) {

    var string = "<" + element.nodeName.toLowerCase();

    Array.prototype.forEach.call(element.attributes, function (attr) {

        string += " " + attr.name;

        if (attr.value) {
            string += "=\"" + attr.value + "\"";
        }

    });

    return string + ">";

}
