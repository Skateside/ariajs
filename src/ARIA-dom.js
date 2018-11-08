/**
 * A wrapper for setting an attribute on an element. This allows the method to
 * be easily replaced for virtual DOMs.
 *
 * @param {Element} element
 *        Element whose attribute should be set.
 * @param {String} name
 *        Name of the attribute to set.
 * @param {String} value
 *        Value of the attribute.
 */
ARIA.setAttribute = function (element, name, value) {
    element.setAttribute(name, value);
};

/**
 * A wrapper for getting an attribute of an element. THis allows the method to
 * be easily replaced for virtual DOMs.
 *
 * @param  {Element} element
 *         Element whose attribute should be retrieved.
 * @param  {String} name
 *         Name of the attribute to retrieve.
 * @return {String|null}
 *         The value of the attribute or null if that attribute does not exist.
 */
ARIA.getAttribute = function (element, name) {
    return element.getAttribute(name);
};

/**
 * A wrapper for checking for an attribute on an element. THis allows the method
 * to be easily replaced for virtual DOMs.
 *
 * @param  {Element} element
 *         Element whose attribute should be checked.
 * @param  {String} name
 *         Name of the attribute to check.
 * @return {Boolean}
 *         true if the element has the given attribute, false otherwise.
 */
ARIA.hasAttribute = function (element, name) {
    return element.hasAttribute(name);
};

/**
 * A wrapper for removing an attribute from an element. THis allows the method
 * to be easily replaced for virtual DOMs.
 *
 * @param {Element} element
 *        Element whose attribute should be removed.
 * @param {String} name
 *        Name of the attribute to remove.
 */
ARIA.removeAttribute = function (element, name) {
    element.removeAttribute(name);
};

/**
 * Checks to see if the given element matches the given selector, returning
 * true if it does.
 *
 * @function
 * @param    {Element} element
 *           Element to test.
 * @param    {String} selector
 *           CSS selector to check against.
 * @return   {Boolean}
 *           true if the element matches the given selector, false otherwise.
 */
ARIA.is = (
    Element.prototype.matches
    ? function (element, selector) {
        return element.matches(selector);
    }
    : (
        Element.prototype.msMatchesSelector
        ? function (element, selector) {
            return element.msMatchesSelector(selector);
        }
        : function (element, selector) {

            var elements = document.querySelectorAll(selector);
            var length = elements.length;
            var isMatch = false;

            while (length) {

                length -= 1;

                if (elements[length] === element) {

                    isMatch = true;
                    break;

                }

            }

            return isMatch;

        }
    )
);

/**
 * Gets an element by the given ID. If the element cannot be found, null is
 * returned. This function is just a wrapper for document.getElementById to
 * allow the library to be easily modified in case a virtual DOM is being used.
 *
 * @param  {String} id
 *         ID of the element to find.
 * @return {Element|null}
 *         Element with the given ID or null if the element cannot be found.
 */
ARIA.getById = function (id) {
    return document.getElementById(id);
};

var counter = 0;

/**
 * The default prefix for {@link ARIA.identify}.
 * @type {String}
 */
ARIA.defaultIdentifyPrefix = "anonymous-element-";

/**
 * Returns the ID of the given element. If the element does not have an ID, a
 * unique one is generated. THe Generated ID is the given prefix and an
 * incrementing counter.
 * Pro tip: The HTML specs state that element IDs should start with a letter.
 *
 * @param  {Element} element
 *         Element whose ID should be returned.
 * @param  {String} [prefix=ARIA.defaultIdentifyPrefix]
 *         Prefix for the generated ID.
 * @return {String}
 *         The ID of the element.
 * @see    http://api.prototypejs.org/dom/Element/identify/
 */
ARIA.identify = function (element, prefix) {

    var id = ARIA.getAttribute(element, "id");

    if (prefix === undefined) {
        prefix = ARIA.defaultIdentifyPrefix;
    }

    if (!id) {

        do {

            id = prefix + counter;
            counter += 1;

        } while (ARIA.getById(id));

        ARIA.setAttribute(element, "id", id);

    }

    return id;

};

/**
 * Checks to see if the given value is a Node.
 *
 * @param  {?} value
 *         Value to test.
 * @return {Boolean}
 *         true if the given value is a Node, false otherwise.
 */
ARIA.isNode = function (value) {
    return (value instanceof Node);
};
