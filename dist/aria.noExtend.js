/*! ariajs - v0.2.0 - MIT license - https://github.com/Skateside/ariajs - 2018-11-11 */
(function (globalVariable) {
    "use strict";

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
 * A basic fallback for the isNaN function.
 *
 * @private
 * @function
 * @param    {?} value
 *           Value to test.
 * @return   {Boolean}
 *           true if the value is NaN, false otherwise.
 */
var isNotANumber = Number.isNaN || globalVariable.isNaN;

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
 * @namespace
 */
var ARIA = {

    /**
     * Collection of all valid tokens for any given attribute. The attribute
     * key should be the normalised value - see {@link ARIA.normalise}.
     * @type {[type]}
     */
    tokens: objectAssign(Object.create(null), {
        "aria-autocomplete": [
            "none",
            "inline",
            "list",
            "both"
        ],
        "aria-current": [
            "false",
            "true",
            "page",
            "step",
            "location",
            "date",
            "time"
        ],
        "aria-dropeffect": [
            "none",
            "copy",
            "execute",
            "link",
            "move",
            "popup"
        ],
        "aria-haspopup": [
            "false",
            "true",
            "menu",
            "listbox",
            "tree",
            "grid",
            "dialog"
        ],
        "aria-invalid": [
            "false",
            "true",
            "grammar",
            "spelling"
        ],
        "aria-live": [
            "off",
            "assertive",
            "polite"
        ],
        "aria-orientation": [
            undefined,
            "undefined",
            "horizontal",
            "vertical"
        ],
        "aria-relevant": [
            "additions",
            "all",
            "removals",
            "text"
        ],
        "aria-sort": [
            "none",
            "ascending",
            "descending",
            "other"
        ],
        // "Authors MUST NOT use abstract roles in content."
        // https://www.w3.org/TR/wai-aria-1.1/#abstract_roles
        "role": [
            "alert",
            "alertdialog",
            "application",
            "article",
            "banner",
            "button",
            "cell",
            "checkbox",
            "columnheader",
            "complementary",
            "combobox",
            // "command", // (abstract)
            // "composite", // (abstract)
            "contentinfo",
            "definition",
            "dialog",
            "directory",
            "document",
            "feed",
            "figure",
            "form",
            "grid",
            "gridcell",
            "group",
            "heading",
            "img",
            // "input", // (abstract)
            // "landmark", // (abstract)
            "link",
            "list",
            "listbox",
            "listitem",
            "log",
            "main",
            "marquee",
            "math",
            "menu",
            "menubar",
            "menuitem",
            "menuitemcheckbox",
            "menuitemradio",
            "navigation",
            "none",
            "note",
            "option",
            "presentation",
            "progressbar",
            "radio",
            "radiogroup",
            // "range", // (abstract)
            "region",
            // "roletype", // (abstract)
            "row",
            "rowgroup",
            "rowheader",
            "scrollbar",
            "search",
            "searchbox",
            // "section", // (abstract)
            // "sectionhead", // (abstract)
            // "select", // (abstract)
            "separator",
            "slider",
            "spinbutton",
            "status",
            // "structure", // (abstract)
            "switch",
            "tab",
            "table",
            "tablist",
            "tabpanel",
            "term",
            "textbox",
            "timer",
            "toolbar",
            "tooltip",
            "tree",
            "treegrid",
            "treeitem"
            // "widget", // (abstract)
            // "window", // (abstract)
        ]
    })

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
    value: "0.2.0"
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

/**
 * Name of the property for the {@link ARIA.Element} instance on DOM nodes.
 * @type {String}
 */
ARIA.extendDOM = "aria";

/**
 * Map of all mis-spellings and aliases. The attribute key should be the
 * normalised value - see {@link ARIA.normalise}.
 * @type {Object}
 */
ARIA.translate = objectAssign(Object.create(null), {
    "aria-role": "role",
    "aria-tabindex": "tabindex"
});

/**
 * Normalises an attribute name so that it is in lowercase and always starts
 * with "aria-". This function has the alias of {@link ARIA.normalize} and
 * changing one will update the other.
 *
 * @memberof ARIA
 * @name     normalise
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
 * A map of all conversions for {@link ARIA.getSuffix}. As well as acting like a
 * cache for frequent conversions, this also allows plugins to use un-expected
 * attribute names since the conversion can be added here.
 * @type {Object}
 */
ARIA.suffixMap = Object.create(null);

/**
 * Converts the attribute into the WAI-ARIA suffic (e.g. "aria-label" becomes
 * "label" etc.).
 *
 * @param  {String} attribute
 *         Attribute whose stemp should be returned.
 * @return {String}
 *         Stem of the attribute.
 */
ARIA.getSuffix = function (attribute) {

    var mapped = ARIA.suffixMap[attribute];

    if (!mapped) {

        mapped = attribute.replace(/^aria\-/, "");
        ARIA.suffixMap[attribute] = mapped;

    }

    return mapped;

};

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
 * @see    https://johnresig.com/blog/simple-javascript-inheritance/
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
 * A wrapper for getting an attribute of an element. This allows the method to
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
 * A wrapper for checking for an attribute on an element. This allows the method
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
 * A wrapper for removing an attribute from an element. This allows the method
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
 * unique one is generated. The generated ID is the given prefix and an
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

/**
 * Handles basic WAI-ARIA properties.
 *
 * @class ARIA.Property
 */
ARIA.Property = ARIA.createClass(/** @lends ARIA.Property.prototype */{

    /**
     * @constructs ARIA.Property
     * @param      {Element} element
     *             Element whose attribute should be handled.
     * @param      {String} attribute
     *             Name of the attribute to handle.
     * @param      {Array.<String>} [tokens]
     *             Optional white-list of valid tokens for this property.
     */
    init: function (element, attribute, tokens) {

        /**
         * Element whose attribute is being handled.
         * @type {Element}
         */
        this.element = element;

        /**
         * Attribute being handled.
         * @type {String}
         */
        this.attribute = attribute;

        /**
         * White-list of valid tokens. This is a reference to a property of
         * {@link ARIA.tokens} so updating that property will update all these
         * instances.
         * @type {Array.<String>}
         */
        this.tokens = (
            (tokens && Array.isArray(tokens))
            ? tokens
            : []
        );

        // Things like ARIA.List work with interpretted values rather than just
        // the attribute value. If the attribute already exists, pass the value
        // to the set method to allow for that. As a bonus, this can filter out
        // invalid attribute values.
        if (ARIA.hasAttribute(element, attribute)) {
            this.set(ARIA.getAttribute(element, attribute));
        }

    },

    /**
     * Interprets the given value so it can be set.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {String}
     *         String based on the value.
     */
    interpret: function (value) {
        return ARIA.Property.interpret(value);
    },

    /**
     * Checks to see if the given token is valid for this current property. This
     * function checks against {@link ARIA.Property#tokens}. If the token is not
     * valid, a warning it sent. See {@link ARIA.warn}.
     *
     * @param  {String} token
     *         Token to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    isValidToken: function (token) {

        var isValid = (!this.tokens.length || this.tokens.indexOf(token) > -1);

        if (!isValid) {
            ARIA.warn(ARIA.WARNING_INVALID_TOKEN, token, this.attribute);
        }

        return isValid;

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} and interprets it
     * (see {@link ARIA.Property#interpret}). If {@link ARIA.Property#element}
     * doesn't have {@link ARIA.Property#attribute} then null is returned.
     *
     * @return {String|null}
     *         Interpretted value of {@link ARIA.Property#attribute} or null if
     *         the attribute is not set.
     */
    get: function () {

        var element = this.element;
        var attribute = this.attribute;

        return (
            ARIA.hasAttribute(element, attribute)
            ? this.interpret(ARIA.getAttribute(element, attribute))
            : null
        );

    },

    /**
     * Sets {@link ARIA.Property#attribute} to the given value, once
     * interpretted (see {@link ARIA.Property#interpret}) and validated (see
     * {@link ARIA.Property#isValidToken}). If the value is interpretted as an
     * empty string, the attribute is removed.
     *
     * @param {?} value
     *        Value to set.
     */
    set: function (value) {

        var element = this.element;
        var attribute = this.attribute;
        var interpretted = this.interpret(value);

        if (interpretted !== "" && this.isValidToken(interpretted)) {
            ARIA.setAttribute(element, attribute, interpretted);
        } else if (interpretted === "") {
            ARIA.removeAttribute(element, attribute);
        }

    },

    /**
     * Returns the value of {@link ARIA.Property#attribute} as a string. See
     * {@link ARIA.Property#get}.
     *
     * @return {String}
     *         Value of the attribute.
     */
    toString: function () {
        return ARIA.getAttribute(this.element, this.attribute) || "";
    }

});

/**
 * Interprets the given value so it can be set. This is used to power
 * {@link ARIA.Property#interpret} while also being exposed so other functions
 * and classes can use it.
 *
 * @param  {?} value
 *         Value to interpret.
 * @return {String}
 *         String based on the value.
 */
ARIA.Property.interpret = function (value) {

    return (
        (value === null || value === undefined)
        ? ""
        : String(value).trim()
    );

};

/**
 * Handles number values.
 *
 * @class ARIA.Integer
 * @extends ARIA.Property
 */
ARIA.Number = ARIA.createClass(ARIA.Property, /** @lends ARIA.Number.prototype */{

    /**
     * Interprets the value as a number. If the value can't be converted into a
     * number, NaN is returned.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Number}
     *         Number value.
     */
    interpret: function (value) {
        return parseFloat(this.$super(value));
    },

    /**
     * @inheritDoc
     */
    isValidToken: function (value) {

        var interpretted = this.interpret(value);
        var isValid = !isNotANumber(interpretted);
        var attribute = this.attribute;
        var min = this.min;
        var max = this.max;

        if (!isValid) {
            ARIA.warn(ARIA.WARNING_INVALID_TOKEN, value, attribute);
        } else if (!isNotANumber(min) && interpretted < min) {

            ARIA.warn(ARIA.WARNING_VALUE_TOO_LOW, value, attribute, min);
            isValid = false;

        } else if (!isNotANumber(max) && interpretted > max) {

            ARIA.warn(ARIA.WARNING_VALUE_TOO_HIGH, value, attribute, max);
            isValid = false;

        }

        return isValid;

    },

    /**
     * Sets the minimum value that is considered valid.
     *
     * @param {Number|String} min
     *        Minimum value.
     */
    setMin: function (min) {

        /**
         * The minimum value that is considered valid.
         * @type {Number}
         */
        this.min = this.interpret(min);

    },

    /**
     * Sets the maximum value that is considered valid.
     *
     * @param {Number|String} max
     *        Maximum value.
     */
    setMax: function (max) {

        /**
         * The maximum value that is considered valid.
         * @type {Number}
         */
        this.max = this.interpret(max);

    }

});

/**
 * Handles number values.
 *
 * @class ARIA.Integer
 * @extends ARIA.Number
 */
ARIA.Integer = ARIA.createClass(ARIA.Number, /** @lends ARIA.Integer.prototype */{

    /**
     * Interprets the value as an integer. If the value can't be converted into
     * a number, NaN is returned.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Number}
     *         Number value.
     */
    interpret: function (value) {
        return Math.floor(this.$super(value));
    }

});

/**
 * Handles WAI-ARIA states.
 *
 * @class ARIA.State
 * @extends ARIA.Property
 */
ARIA.State = ARIA.createClass(ARIA.Property, /** @lends ARIA.State.prototype */{

    /**
     * Unlike the parent {@link ARIA.Property}, an instance of ARIA.State cannot
     * have tokens set.
     *
     * @constructs ARIA.State
     * @param      {Element} element
     *             Element whose attribute should be handled.
     * @param      {String} attribute
     *             Name of the attribute to handle.
     */
    init: function (element, attribute) {

        this.$super(element, attribute, [
            "true",
            "false"
        ]);

    },

    /**
     * @inheritDoc
     */
    isValidToken: function (token) {
        return typeof token === "boolean" || this.$super(token);
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

        var interpretted = this.$super(value);
        var isTrue = interpretted === "true";

        return (
            (isTrue || interpretted === "false")
            ? isTrue
            : interpretted
        );

    }

});

/**
 * Handles a WAI-ARIA state that can be true or false but can also be undefined.
 *
 * @class ARIA.UndefinedState
 * @extends ARIA.State
 */
ARIA.UndefinedState = ARIA.createClass(ARIA.State, /** @lends ARIA.UndefinedState.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        this.$super(element, attribute);
        this.tokens.push("undefined");

    },

    /**
     * @inheritDoc
     */
    isValidToken: function (token) {
        return token === undefined || this.$super(token);
    },

    /**
     * Interprets undefined as "undefined.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Boolean|String}
     *         Either the boolean value, "undefined" or an empty string if the
     *         value is not understood.
     */
    interpret: function (value) {

        return (
            (value === undefined || value === "undefined")
            ? "undefined"
            : this.$super(value)
        );

    },

    /**
     * Returns a boolean or undefined.
     *
     * @return {Boolean|undefined}
     *         Value of the attribute.
     */
    get: function () {

        var value = this.$super();

        if (value === "undefined") {
            value = undefined;
        }

        return value;

    }

});

/**
 * Handles WAI-ARIA tristates. That is, a state that can be either true, false
 * or "mixed".
 *
 * @class ARIA.Tristate
 * @extends ARIA.State
 */
ARIA.Tristate = ARIA.createClass(ARIA.State, /** @lends ARIA.Tristate.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        this.$super(element, attribute);
        this.tokens.push("mixed");

    },

    /**
     * Allows the token "mixed".
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Boolean|String}
     *         Either the boolean value, "mixed" or an empty string if the value
     *         is not understood.
     */
    interpret: function (value) {

        return (
            value === "mixed"
            ? value
            : this.$super(value)
        );

    }

});

/**
 * Handles a WAI-ARIA attribute that should be a space-separated list.
 *
 * @class ARIA.List
 * @extends ARIA.Property
 */
ARIA.List = ARIA.createClass(ARIA.Property, /** ARIA.List.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute, tokens) {

        /**
         * The list of values.
         * @type {Array.<String>}
         */
        this.list = [];

        this.$super(element, attribute, tokens);

    },

    /**
     * Coerces the values into a string and splits it at the spaces.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Array.<String>}
     *         Array of strings.
     */
    interpret: function (value) {

        var val = (
            Array.isArray(value)
            ? value.join(" ")
            : value
        );
        var string = this.$super(val);

        return (
            string.length
            ? string.split(/\s+/)
            : []
        );

    },

    /**
     * Sets the value of the list to be the given value. The values are
     * interpretted as an array (see {@link ARIA.List#interpret} and validated
     * (see {@link ARIA.List#isValidToken}); only unique values are added.
     *
     * @param {?} value
     *        Value(s) to add. If the given value is a string, it is assumed to
     *        be a space-separated list.
     */
    set: function (value) {

        var that = this;
        var values = that.interpret(value).reduce(function (unique, token) {

            if (
                token
                && that.isValidToken(token)
                && unique.indexOf(token) < 0
            ) {
                unique.push(token);
            }

            return unique;

        }, []);
        var element = that.element;
        var attribute = that.attribute;

        that.list = values;

        if (values.length) {
            ARIA.setAttribute(element, attribute, values.join(" "));
        } else {
            ARIA.removeAttribute(element, attribute);
        }

    },

    /**
     * Gets the value of the attribute as an array.
     *
     * @return {Array.<String>}
     *         Value of the attribute as an array.
     */
    get: function () {
        return this.list.concat();
    }

});

/**
 * Handles WAI-ARIA attributes that reference a single ID.
 *
 * @class ARIA.Reference
 * @extends ARIA.Property
 */
ARIA.Reference = ARIA.createClass(ARIA.Property, /** @lends ARIA.Reference.prototype */{

    /**
     * Interprets the given value as a string. If the value is an element, the
     * element's ID is returned, generating one if necessary - see
     * {@link ARIA.identify}.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {String}
     *         The interpretted value.
     */
    interpret: function (value) {
        return ARIA.Reference.interpret(value);
    },

    /**
     * Gets the element referenced by this attribute. If the element cannot be
     * found or the attribute isn't set, null is returned.
     *
     * @return {Element|null}
     *         Element referenced by this attribute or null if the element
     *         cannot be found or the attribute isn't set.
     */
    get: function () {
        return ARIA.getById(this.$super());
    }

});

/**
 * Interprets the given value as a string. If the value is an element, the
 * element's ID is returned, generating one if necessary = see
 * {@link ARIA.identify}. This powers {@link ARIA.Reference#interpret} while
 * also allowing other functions and classes to use it.
 *
 * @param  {?} value
 *         Value to interpret.
 * @return {String}
 *         The interpretted value.
 */
ARIA.Reference.interpret = function (value) {

    return (
        ARIA.isNode(value)
        ? ARIA.identify(value)
        : ARIA.Property.interpret(value)
    );

};

/**
 * Handles WAI-ARIA attributes that handle space-separated lists of IDs.
 * @class ARIA.ReferenceList
 * @extends ARIA.List
 */
ARIA.ReferenceList = ARIA.createClass(ARIA.List, /** @lends ARIA.ReferenceList.prototype */{

    /**
     * Interprets an element, ID or array of elements or/and IDs as an array of
     * element IDs.
     *
     * @param  {Array.<Element|String>|Element|String} value
     *         Value(s) to interpret.
     * @return {Array.<String>}
     *         Collection of IDs.
     */
    interpret: function (value) {

        var interpretted = [];

        if (
            value
            && typeof value === "object"
            && typeof value.length === "number"
        ) {
            interpretted = arrayFrom(value, ARIA.Reference.interpret, this);
        } else if (typeof value === "string") {
            interpretted = this.$super(value);
        } else {
            interpretted = [ARIA.Reference.interpret(value)];
        }

        // Remove all falsy values such as "" or null.
        return interpretted.filter(Boolean);

    },

    /**
     * Gets an array of elements referenced by the attribute. If the element
     * cannot be found, null will be in place of the element.
     *
     * @return {Array.<Element|null>}
     *         Array of elements.
     */
    get: function () {
        return this.$super().map(ARIA.getById);
    }

});

/**
 * Handles the WAI-ARIA attributes on an element.
 *
 * @class ARIA.Element
 */
ARIA.Element = ARIA.createClass(/** @lends ARIA.ELement.prototype */{

    /**
     * @constructs ARIA.Element
     * @param      {Element} element
     *             Element whose WAI-ARIA attributes should be handled.
     */
    init: function (element) {

        /**
         * Element whose WAI-ARIA attributes should be handled.
         * @type {Element}
         */
        this.element = element;

        /**
         * A flag object that keeps track of attributes being modified. Prevents
         * infinitely loops being caused in the MutationObserver.
         * @type {Object}
         */
        // this.manipulationFlags = Object.create(null);

        /**
         * Instances of {@link ARIA.Property} (or sub-classes) that are used to
         * check get and set values.
         * @type {Object}
         */
        this.instances = Object.create(null);

        // this.preloadAttributes();
        this.readAttributes();
        this.observeAttributes();

        return this.activateTraps();

    },

    /**
     * Gets the instance from {@link ARIA.Element#instances} for the given
     * attribute. If the instance does not exist but a factory exists, the
     * instance is created and stored before being returned.
     *
     * @param  {String} attribute
     *         Attribute whose instance should be found.
     * @return {ARIA.Property}
     *         Instance of {@link ARIA.Property} (or sub-class).
     */
    getInstance: function (attribute) {

        var instance = this.instances[attribute];

        if (!instance && ARIA.getFactory(attribute)) {

            instance = ARIA.runFactory(attribute, this.element);
            this.instances[attribute] = instance;

        }

        return instance;

    },

    /**
     * Reads all the WAI-ARIA attributes on {@link ARIA.Element#element} and
     * sets the {@link ARIA.Property} values.
     */
    readAttributes: function () {

        arrayFrom(this.element.attributes, function (attribute) {

            var value = attribute.value;
            var instance = (
                value
                ? this.getInstance(attribute.name)
                : undefined
            );

            if (instance) {
                instance.set(value);
            }

        }, this);

    },

    /**
     * Creates the observer {@link ARIA.Element#observer} that listens for
     * changes to WAI-ARIA attribtues and updates the {@link ARIA.Property}
     * values.
     */
    observeAttributes: function () {

        var that = this;

        /**
         * The observer.
         * @type {MutationObserver}
         */
        that.observer = ARIA.Element.makeObserver(
            that.element,
            function (data) {
                return Boolean(ARIA.factories[data.suffix]);
            },
            function (data) {
                that[data.suffix] = data.value;
            },
            function (data) {
                that[data.suffix] = "";
            }
        );

    },

    /**
     * Disconnects {@link ARIA.Element#observer}.
     */
    disconnectAttributes: function () {
        this.observer.disconnect();
    },

    /**
     * Activates the get, set and delete traps for the instance which enables
     * the interface.
     *
     * @return {Proxy}
     *         Proxy of the instance (if the browser supports it).
     */
    activateTraps: function () {

        return new Proxy(this, {

            get: function (target, name) {

                var value = target[name];
                var instance = target.getInstance(name);

                if (instance) {
                    value = instance.get();
                }

                return value;

            },

            set: function (target, name, value) {

                var instance = target.getInstance(name);

                if (instance) {
                    instance.set(value);
                } else {
                    target[name] = value;
                }

                return value;

            },

            deleteProperty: function (target, name) {

                var instance = target.getInstance(name);

                if (instance) {
                    instance.set("");
                } else {
                    delete target[name];
                }

                return true;

            }

        });

    }

});

/**
 * Creates an observer to listen for attribute changes.
 *
 * @param  {Element} element
 *         Element whose attribute changes should be observed.
 * @param  {Function} checker
 *         Function to execute when checking whether the attribute change should
 *         be observed. Accepts an object with "attribute" and "suffix"
 *         properties, returns a boolean.
 * @param  {Function} setter
 *         Function to execute when an attribute change has been detected.
 *         Accepts an object and "attribute", "suffix", "value" and "old"
 *         properties.
 * @param  {Function} unsetter
 *         Function to execute when an attribute has been removed. Accepts an
 *         object with "attribute" and "suffix" properties.
 * @return {MutationObserver}
 *         MutationObserver that observes the attribute changes.
 */
ARIA.Element.makeObserver = function (element, checker, setter, unsetter) {

    var manipulationFlags = Object.create(null);
    var observer = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {

            var attribute = mutation.attributeName || "";
            var suffix = ARIA.getSuffix(attribute);
            var data = {
                attribute: attribute,
                suffix: suffix
            };

            if (
                mutation.type === "attributes"
                && !manipulationFlags[suffix]
                && checker(data)
            ) {

                manipulationFlags[suffix] = true;

                if (ARIA.hasAttribute(element, attribute)) {

                    data.value = ARIA.Property.interpret(
                        ARIA.getAttribute(element, attribute)
                    );
                    data.old = ARIA.Property.interpret(mutation.oldValue);
                    setter(data);

                } else {
                    unsetter(data);
                }

                requestAnimationFrame(function () {
                    delete manipulationFlags[suffix];
                });

            }

        });

    });

    observer.observe(element, {
        attributes: true,
        attributeOldValue: true
    });

    return observer;

};

// Create a fall-back for browsers that don't understand Proxy.
// Object.defineProperty can be used for get and set, but delete will have to
// rely on polling.
if (!globalVariable.Proxy) {

    ARIA.Element.prototype.activateTraps = function () {

        var that = this;
        var owns = Object.prototype.hasOwnProperty.bind(that);

        Object.keys(ARIA.factories).forEach(function setProperty(attribute) {

            var isPolling = false;

            Object.defineProperty(that, attribute, {

                configurable: true,

                get: function () {
                    return that.getInstance(attribute).get();
                },

                set: function (value) {

                    var instance = that.getInstance(attribute);

                    if (value === "") {
                        isPolling = false;
                    } else if (value !== "" && !isPolling) {

                        requestAnimationFrame(function poll() {

                            if (isPolling) {

                                if (owns(attribute)) {

                                    requestAnimationFrame(poll);
                                    isPolling = true;

                                } else {

                                    isPolling = false;
                                    instance.set("");
                                    setProperty(attribute);

                                }

                            }

                        });
                        isPolling = true;

                    }

                    return instance.set(value);

                }

            });

        });

    };

}

/**
 * Collection of factories for creating WAI-ARIA libraries. The attribute key
 * should be the attribute suffixes (e.g. "label" for "aria-label" etc.)
 * @type {Object}
 */
ARIA.factories = Object.create(null);

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
        || ARIA.factories[ARIA.getSuffix(ARIA.normalise(attribute))]
    );

};

/**
 * Executes the factory for the given attribute, passing in given parameters.
 * See {@link ARIA.getFactory}.
 *
 * @param  {String} attribute
 *         Attribute whose factory should be executed.
 * @param  {Element} element
 *         Element that should be passed to the factory.
 * @return {ARIA.Property}
 *         Instance of {@link ARIA.Property} (or sub-class) created by the
 *         factory.
 * @throws {ReferenceError}
 *         There must be a factory for the given attribute.
 */
ARIA.runFactory = function (attribute, element) {

    var factory = ARIA.getFactory(attribute);

    if (!factory) {
        throw new ReferenceError(attribute + " is not a recognised factory");
    }

    return factory(element);

};

/**
 * Creates a factory that creates an aria property.
 *
 * @param  {String} attribute
 *         Normalised name of the attribute whose factory is created.
 * @param  {Function} Constructor
 *         Constructor for {@link ARIA.Property} (or sub-class) that will create
 *         the property.
 * @param  {Function} [modify]
 *         Optional function for modifying the {@link ARIA.Property} instance
 *         before it's returned.
 * @return {Function}
 *         A factory function that takes the element and returns the instance.
 */
ARIA.makeFactory = function (attribute, Constructor, modify) {

    return function (element) {

        var instance;
        var tokens = ARIA.tokens[attribute];

        if (!tokens) {

            tokens = [];
            ARIA.tokens[attribute] = tokens;

        }

        instance = new Constructor(element, attribute, tokens);

        if (typeof modify === "function") {
            modify(instance);
        }

        return instance;

    };

};

var factoryEntries = [
    [ARIA.Property, [
        "autocomplete",
        "current",
        "haspopup",
        "invalid",
        "keyshortcuts",
        "label",
        "live",
        "orientation",
        "placeholder",
        "roledescription",
        "sort",
        "valuetext"
    ]],
    [ARIA.Reference, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [ARIA.ReferenceList, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [ARIA.State, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [ARIA.Tristate, [
        "checked",
        "pressed"
    ]],
    [ARIA.UndefinedState, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [ARIA.Integer, [
        "colcount",
        "colindex",
        "colspan",
        "level",
        "posinset",
        "rowcount",
        "rowindex",
        "rowspan",
        "setsize"
    ]],
    [ARIA.Integer, [
        "tabindex"
    ], function (instance) {

        var uInt16 = Math.pow(2, 16);

        instance.setMin(uInt16 / -2);
        instance.setMax((uInt16 / 2) - 1);

    }],
    [ARIA.Number, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [ARIA.List, [
        "dropeffect",
        "relevant",
        "role"
    ]]
];

factoryEntries.forEach(function (entry) {

    entry[1].forEach(function (attribute) {

        ARIA.factories[attribute] = ARIA.makeFactory(
            ARIA.normalise(attribute),
            entry[0],
            entry[2]
        );

    });

});

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

ARIA.addAlias("labelledby", "labeledby");
}(window));
//# sourceMappingURL=aria.noExtend.js.map
