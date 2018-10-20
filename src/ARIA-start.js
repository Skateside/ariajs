/**
 * @namespace
 */
var ARIA = {

    /**
     * Collection of factories for creating WAI-ARIA libraries.
     * @type {Object}
     */
    factories: Object.create(null),

    /**
     * Map of all mis-spellings and aliases.
     * @type {Object}
     */
    translate: Object.create(null)

};

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
 * Simple fall-back for Array.from.
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
 * Normalises an attribute name so that it is in lowercase and always starts
 * with "aria-". This function has the alias of {@link ARIA.normalize} and
 * changing one will update the other.
 *
 * @memberof ARIA
 * @param    {String} attribute
 *           Attribute to normalise.
 * @return   {String}
 *           Normalised attribute.
 *
 * @example
 * ARIA.normalise("aria-busy"); // -> "aria-busy"
 * ARIA.normalise("busy"); // -> "aria-busy"
 * ARIA.normalise("  busy  "); // -> "aria-busy"
 * ARIA.normalise("BUSY"); // -> "aria-busy"
 */
var normalise = function (attribute) {

    var string = String(attribute)
        .toLowerCase()
        .replace(/^\s*(?:aria\-)?|\s*$/g, "");
    var normal = "aria-" + string;

    return ARIA.translate[normal] || normal;

};

var normaliseDescriptor = {

    configurable: false,
    enumerable: true,

    get: function () {
        return normalise;
    },

    set: function (normaliser) {
        normalise = normaliser;
    }

};

Object.defineProperties(ARIA, {

    normalise: normaliseDescriptor,

    /**
     * An alias of {@link ARIA.normalise}.
     *
     * @memberof ARIA
     * @function
     */
    normalize: normaliseDescriptor

});

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

/**
 * Adds one or more methods to the class.
 *
 * @memberof Class
 * @name     addMethod
 * @static
 * @param    {Object|String} name
 *           Either the name of the method to add or an object of names to
 *           methods.
 * @param    {Function} [method]
 *           Method to add to the class.
 */
function addClassMethods(name, method) {

    var parent = this.parent;

    if (typeof name === "object") {

        Object.keys(name).forEach(function (key) {
            addClassMethods.call(this, key, name[key]);
        }, this);

    } else {

        this.prototype[name] = (
            (
                typeof method === "function"
                && typeof parent[name] === "function"
                && fnTest.test(method)
            )
            ? function () {

                var hasSuper = "$super" in this;
                var temp = this.$super;
                var returnValue = null;

                this.$super = parent[name];
                returnValue = method.apply(this, arguments);

                if (hasSuper) {
                    this.$super = temp;
                } else {
                    delete this.$super;
                }

                return returnValue;

            }
            : method
        );

    }

}

/**
 * Creates a Class.
 *
 * @param  {Class} [Base]
 *         Optional parent class.
 * @param  {Object} proto
 *         Methods to add to the created Class' prototype.
 * @return {Class}
 *         Class created.
 */
ARIA.createClass = function (Base, proto) {

    function Class() {
        return this.init.apply(this, arguments);
    }

    if (!proto) {

        proto = Base;
        Base = Object;

    }

    Class.addMethod = addClassMethods;

    /**
     * Alias of {@link Class.addMethod}
     */
    Class.addMethods = addClassMethods;

    /**
     * Reference to the prototype of the Class' super-class.
     * @type {Object}
     */
    Class.parent = Base.prototype;

    Class.prototype = Object.create(Base.prototype);
    addClassMethods.call(Class, proto);

    Class.prototype.constructor = Class;

    if (typeof Class.prototype.init !== "function") {
        Class.prototype.init = noop;
    }

    return Class;

};

/**
 * Gets the factory from {@link ARIA.factories} that matches either the given
 * attribute or the normalised version (see {@link ARIA.normalise}).
 *
 * @param  {String} attribute
 *         Attribute whose factory should be returned.
 * @return {Function}
 *         Factory for creating the attribute.
 */
ARIA.getFactory = function (attribute) {

    return (
        ARIA.factories[attribute]
        || ARIA.factories[ARIA.normalise(attribute)]
    );

};

/**
 * Executes the factory for the given attribute, passing in given parameters.
 * See {@link ARIA.getFactory}.
 *
 * @param  {String} attribute
 *         Attribute whose factory should be executed.
 * @param  {...?} [arguments]
 *         Optional parameters to pass to the factory.
 * @return {?}
 *         Result of executing the factory.
 * @throws {ReferenceError}
 *         There must be a factory for the given attribute.
 */
ARIA.runFactory = function (attribute) {

    var factory = ARIA.getFactory(attribute);

    if (!factory) {
        throw new ReferenceError(attribute + " is not a recognised factory");
    }

    return factory.apply(undefined, Array.prototype.slice.call(arguments, 1));

};

/**
 * Creates an alias of WAI-ARIA attributes.
 *
 * @param  {String} source
 *         Source attribute for the alias.
 * @param  {Array.<String>|String} aliases
 *         Either a single alias or an array of aliases.
 * @throws {ReferenceError}
 *         The source attribute must have a related factory.
 */
ARIA.addAlias = function (source, aliases) {

    var normalSource = ARIA.normalise(source).slice(5);

    if (!Array.isArray(aliases)) {
        aliases = [aliases];
    }

    if (!ARIA.getFactory(normalSource)) {

        throw new ReferenceError(
            "ARIA.factories."
            + normalSource
            + " does not exist"
        );

    }

    aliases.forEach(function (alias) {

        var normalAlias = ARIA.normalise(alias).slice(5);

        ARIA.translate[normalAlias] = normalSource;
        ARIA.factories[normalAlias] = ARIA.factories[normalSource];

    });

};

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
 */
ARIA.identify = function (element, prefix) {

    var id = element.id;

    if (prefix === undefined) {
        prefix = ARIA.defaultIdentifyPrefix;
    }

    if (!id) {

        do {

            id = prefix + counter;
            counter += 1;

        } while (ARIA.getById(id));

        element.id = id;

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

/**
 * Allows an element to be focusable. Optionally, the tabindex can be defined.
 * Be warned that passed a negative value to the tabindex will remove the
 * element from the tab order.
 *
 * @param {Element} element
 *        Element that should become focusable.
 * @param {Number} [tabindex=0]
 *        Optional value of the tabindex.
 */
ARIA.addToTabOrder = function (element, tabindex) {
    element.setAttribute("tabindex", parseInt(tabindex, 10) || 0);
};

/**
 * Removes an element from the tab order.
 *
 * @param {Element} element
 *        Element should be removed from the tab order.
 */
ARIA.removeFromTabOrder = function (element) {
    this.addToTabOrder(element, -1);
};

/**
 * Removes the tabindex from the element, setting their focusable state.
 *
 * @param {Element} element
 *        Element whose tabindex should be removed.
 */
ARIA.resetTabOrder = function (element) {
    element.removeAttribute("tabindex");
};
