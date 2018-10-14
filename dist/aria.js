/*! ariajs - v1.0.0 - MIT license - https://github.com/Skateside/ariajs - 2018-10-14 */
(function (globalVariable) {
    "use strict";

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
    value: "1.0.0"
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
ARIA.makeFocusable = function (element, tabindex) {
    element.setAttribute("tabindex", parseInt(tabindex, 10) || 0);
};

/**
 * Removes an element from the tab order.
 *
 * @param {Element} element
 *        Element should be removed from the tab order.
 */
ARIA.makeUnfocusable = function (element) {
    this.makeFocusable(element, -1);
};

/**
 * Removes the tabindex from the element, setting their focusable state.
 *
 * @param {Element} element
 *        Element whose tabindex should be removed.
 */
ARIA.resetFocusable = function (element) {
    element.removeAttribute("tabindex");
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
     */
    init: function (element, attribute) {

        var that = this;

        /**
         * Element whose attribute is being handled.
         * @type {Element}
         */
        that.element = element;

        /**
         * Attribute being handled.
         * @type {String}
         */
        that.attribute = attribute;
console.warn("Note to self: somewhere here, attributes are being lost :-(");
        // if (that.has()) {
        //     that.set(that.get());
        // }

        /**
         * The value of the {@link ARIA.Property#attribute}.
         *
         * @memberof ARIA.Property
         * @instance
         * @name value
         * @type {String}
         */
        Object.defineProperty(that, "value", {

            get: function () {
                return that.toString();
            }

        });

    },

    /**
     * Sets the white-list of allowed tokens for this property.
     *
     * @param {Array.<String>} tokens
     *        White-list of tokens.
     */
    setTokens: function (tokens) {

        /**
         * White-list of valid tokens.
         * @type {Array.<String>}
         */
        this.tokens = arrayFrom(tokens);

    },

    /**
     * Sets the pattern to work out if values are valid.
     *
     * @param {RegExp} pattern
     *        Pattern for the values.
     */
    setPattern: function (pattern) {

        /**
         * Pattern that values have to match. Be aware that
         * {@link ARIA.Property#tokens} will override this pattern even if they
         * don't match.
         * @type {RegExp}
         */
        this.pattern = pattern;

    },

    /**
     * Checks to see if the given token is valid for this current property. This
     * function checks against {@link ARIA.Property#tokens} and
     * {@link ARIA.Property#pattern} if they're set.
     *
     * @param  {String} token
     *         Token to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    isValidToken: function (token) {

        var tokens = this.tokens;
        var pattern = this.pattern;
        var isValid = true;

        if (tokens && tokens.length) {
            isValid = tokens.indexOf(token) > -1;
        } else if (pattern) {
            isValid = pattern.test(token);
        }

        return isValid;

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
     * Sets {@link ARIA.Property#attribute} to the given value, once
     * interpretted (see {@link ARIA.Property#interpret}) and validated (see
     * {@link ARIA.Property#isValidToken}).
     *
     * @param {?} value
     *        Value to set.
     */
    set: function (value) {

        var token = this.interpret(value);
// console.log("value = %o, token = %o, isValid = %o", value, token, this.isValidToken(token));
        if (token !== "" && this.isValidToken(token)) {
            this.setAttribute(token);
        } else if (token === "") {
            this.removeAttribute();
        }

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} and interprets it
     * (see {@link ARIA.Property#interpret}).
     *
     * @return {String}
     *         Interpretted value of {@link ARIA.Property#attribute}.
     */
    get: function () {
        return this.interpret(this.getAttribute());
    },

    /**
     * Checks whether or not {@link ARIA.Property#attribute} is set on
     * {@link ARIA.Property#element}.
     *
     * @return {Boolean}
     *         true if the attribute is set, false otherwise.
     */
    has: function () {
        return this.hasAttribute();
    },

    /**
     * Removes {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element}.
     */
    remove: function () {
        this.removeAttribute();
    },

    /**
     * Sets the value of {@link ARIA.Property#attribute}. This method bypasses
     * the validation and interpretation processes of {@link ARIA.Property#set}.
     * If value is empty (a falsy valid in JavaScript, but neither false nor 0)
     * then the attribute is removed.
     *
     * @param {String} value
     *        Value of the attribute to set.
     */
    setAttribute: function (value) {

        if (ARIA.Property.interpret(value) !== "") {
            this.element.setAttribute(this.attribute, value);
        } else {
            this.removeAttribute();
        }

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute}. THis bypasses the
     * interpretation of {@link ARIA.Property#get}.
     *
     * @return {String|null}
     *         Value of the attribute or null if the attribute is not set.
     */
    getAttribute: function () {
        return this.element.getAttribute(this.attribute);
    },

    /**
     * Checks to see if {@link ARIA.Property#element} has
     * {@link ARIA.Property#attribute}.
     *
     * @return {Boolean}
     *         true if the attribute is set, false otherwise.
     */
    hasAttribute: function () {
        return this.element.hasAttribute(this.attribute);
    },

    /**
     * Removes {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element}.
     */
    removeAttribute: function () {
        this.element.removeAttribute(this.attribute);
    },

    /**
     * Returns the value of {@link ARIA.Property#attribute} as a string. See
     * {@link ARIA.Property#get}.
     *
     * @return {String}
     *         Value of the attribute.
     */
    toString: function () {
        return this.getAttribute() || "";
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
 * Handles WAI-ARIA states.
 *
 * @class ARIA.State
 * @extends ARIA.Property
 */
ARIA.State = ARIA.createClass(ARIA.Property, /** @lends ARIA.State.prototype */{

    /**
     * Ensures that the given value is either a boolean or a string of "true" or
     * "false". {@link ARIA.Property#tokens} and {@link ARIA.Property#pattern}
     * are ignored.
     *
     * @param  {?} value
     *         Value to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    isValidToken: function (value) {

        return (
            typeof value === "boolean"
            || value === "true"
            || value === "false"
        );

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

        return (
            typeof value === "boolean"
            ? value === true
            : (
                (value === "true" || value === "false")
                ? value === "true"
                : ""
            )
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
     * Allows for true, false or undefined.
     *
     * @inheritDoc
     */
    isValidToken: function (value) {

        return (
            value === undefined
            || value === "undefined"
            || this.$super(value)
        );

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
     * Allows the token "mixed".
     *
     * @inheritDoc
     */
    isValidToken: function (value) {
        return value === "mixed" || this.$super(value);
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
 * The arrays for {@link ARIA.List} instances. This prevents the array from
 * being exposed and manipulated.
 * @private
 * @type {WeakMap}
 */
var lists = new WeakMap();

/**
 * Creates an iterator.
 *
 * @private
 * @param   {ARIA.List} instance
 *          Instance that should gain an iterator.
 * @param   {Function} valueMaker
 *          Function to get the iterator value from the item.
 * @return  {Object}
 *          Iterator response.
 */
var makeIterator = function (instance, valueMaker) {

   var index = 0;
   var list = instance.get();
   var length = list.length;

   return {

       next: function () {

           var iteratorValue = {
               value: valueMaker(list, index),
               done: index >= length
           };

           index += 1;

           return iteratorValue;

       },

       toString: function () {
           return "Array Iterator";
       }

   };

};

/**
 * A version of DOMException that we can actually create.
 *
 * @class
 * @private
 * @extends Error
 * @param   {String} type
 *          Type of exception.
 * @param   {String} message
 *          Message for the exception.
 */
var DOMEx = function (type, message) {

    this.name = type;
    this.code = DOMException[type];
    this.message = message;

};
DOMEx.prototype = Error.prototype;
// DOMEx taken from:
// https://github.com/yola/classlist-polyfill/blob/master/src/index.js

/**
 * Handles a WAI-ARIA attribute that should be a space-separated list. This is
 * moddled on DOMTokenList (such as classList) so it will only accept unique
 * values and will throw errors for invalid values (see
 * {@link ARIA.List#isValidToken}).
 *
 * @class ARIA.List
 * @extends ARIA.Property
 */
ARIA.List = ARIA.createClass(ARIA.Property, /** ARIA.List.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        var that = this;

        lists.set(that, []);

        /**
         * The number of items in this list.
         *
         * @name length
         * @memberof ARIA.List
         * @instance
         * @type {Number}
         */
        Object.defineProperty(that, "length", {

            get: function () {
                return lists.get(that).length;
            }

        });

        this.$super(element, attribute);

    },

    /**
     * Ensures that the token is valid.
     *
     * @param  {?} token
     *         Token to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     * @throws {DOMEx}
     *         Given token cannot be an empty string.
     * @throws {DOMEx}
     *         Given token cannot contain a space.
     */
    isValidToken: function (token) {

        if (token === "") {

            throw new DOMEx(
                "SYNTAX_ERR",
                "An invalid or illegal string was specified"
            );

        }

        if ((/\s/).test(token)) {

            throw new DOMEx(
                "INVALID_CHARACTER_ERR",
                "String contains an invalid character"
            );

        }

        return this.$super(token);

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
     * Sets the value of the list to be the given value, removing all previous
     * values first. To add to the previous values, use {@link ARIA.List#add}.
     * The values are interpretted as an array (see {@link ARIA.List#interpret}
     * and validated (see {@link ARIA.List#isValidToken}); only unique values
     * are added.
     *
     * @param {?} value
     *        Value(s) to add. If the given value is a string, it is assumed to
     *        be a space-separated list.
     */
    set: function (value) {

        var values = this.interpret(value);
        var unwanted = this
            .toArray()
            .filter(function (item) {
                return values.indexOf(item) < 0;
            });
console.log("ARIA.List#set(%o) for attribute %o; values = %o; unwanted = %o", value, this.attribute, values, unwanted);
        if (values.length) {
            this.add.apply(this, values);
        }

        if (unwanted.length) {
            this.remove.apply(this, unwanted);
        }

        this.setAttribute(this.toString());

    },

    /**
     * Gets the value of the attribute as an array.
     *
     * @return {Array.<String>}
     *         Value of the attribute as an array.
     */
    get: function () {
        return this.interpret(this.toString());
    },

    /**
     * Checks to see if the attribute is set. If a parameter is passed, the list
     * is checked to see if it contains the value.
     *
     * @param  {String} [item]
     *         Optional value to check.
     * @return {Boolean}
     *         true if the attribute exists or the value is in the list, false
     *         otherwise.
     */
    has: function (item) {

        return (
            item === undefined
            ? this.hasAttribute()
            : this.contains(item)
        );

    },

    /**
     * Converts the attribute into a string. Optionally, a string can be passed
     * to be used as the glue for the array.
     *
     * @param  {String} [glue=" "]
     *         Optional glue to use to join the array.
     * @return {String}
     *         String from the list.
     */
    toString: function (glue) {

        if (glue === undefined) {
            glue = " ";
        }

        return lists.get(this).join(glue);

    },

    /**
     * Adds the given values to the list. Items are only added if they're valid
     * (see {@link ARIA.List#isValidToken}) and not already in the list.
     *
     * @param {String} ...arguments
     *        Arguments to add.
     */
    add: function () {

        var list = lists.get(this);

        if (arguments.length) {

            arrayFrom(arguments, function (argument) {

                var item = this.interpret(argument)[0];

                if (this.isValidToken(item) && list.indexOf(item) < 0) {
                    list.push(item);
                }

            }, this);

            this.setAttribute(this.toString());

        }

    },

    /**
     * Either removes one or more values from the list or the attribute itself
     * if no parameters are passed.
     *
     * @param {String} [...arguments]
     *        Optional values to remove.
     */
    remove: function () {

        var list = lists.get(this);
        var string;

        if (arguments.length) {

            arrayFrom(arguments, function (argument) {

                var item = this.interpret(argument)[0];
                var index = this.isValidToken(item) && list.indexOf(item);

                if (index > -1) {
                    list.splice(index, 1);
                }

            }, this);

            string = this.toString();

            if (string === "") {
                this.removeAttribute();
            } else {
                this.setAttribute(string);
            }

        } else {

            list.length = 0;
            this.removeAttribute();

        }

    },

    /**
     * Checks to see if the given item is within the list.
     *
     * @param  {String} item
     *         Item to check for.
     * @return {Boolean}
     *         true if the item is within the list, false otherwise.
     */
    contains: function (item) {

        var value = this.interpret(item)[0];

        return this.isValidToken(value) && lists.get(this).indexOf(value) > -1;

    },

    /**
     * Gets the item from the list at the specified index. If there is no item
     * at that index, null is returned.
     *
     * @param  {Number} index
     *         Index of the item to retrieve.
     * @return {String|null}
     *         The item at the given index or null if there is no item at that
     *         index.
     */
    item: function (index) {
        return lists.get(this)[Math.floor(index)] || null;
    },

    /**
     * Replaces one value with another one.
     *
     * @param  {String} oldToken
     *         Old value to replace.
     * @param  {String} newToken
     *         New token.
     * @return {Boolean}
     *         true if a replacement was made, false otherwise.
     */
    replace: function (oldToken, newToken) {

        var isReplaced = false;
        var list;
        var index;
        var oldItem = this.interpret(oldToken)[0];
        var newItem = this.interpret(newToken)[0];

        if (this.isValidToken(oldItem) && this.isValidToken(newItem)) {

            list = lists.get(this);
            index = list.indexOf(oldItem);

            if (index > -1) {

                list.splice(index, 1, newItem);
                isReplaced = true;

            }

        }

        return isReplaced;

    },

    /**
     * Loops over the items within the array.
     *
     * @param {Function} handler
     *        Function to execute on each item.
     * @param {?} [context]
     *        Optional context for the function.
     */
    forEach: function (handler, context) {
        lists.get(this).forEach(handler, context);
    },

    /**
     * Converts the list into an array. Optionally, the values can be converted
     * by passing a mapping function.
     *
     * @param  {Function} [map]
     *         Optional conversion function.
     * @param  {?} context
     *         Optional context for the optional function.
     * @return {Array}
     *         Array made from the list.
     */
    toArray: function (map, context) {
        return arrayFrom(lists.get(this), map, context);
    },

    /**
     * Returns an iterator for the entries.
     *
     * @return {Object}
     *         Iterator value.
     */
    entries: function () {

        return makeIterator(this, function (list, index) {
            return [index, list[index]];
        });

    },

    /**
     * Returns an iterator for the keys.
     *
     * @return {Object}
     *         Iterator value.
     */
    keys: function () {

        return makeIterator(this, function (list, index) {
            return index;
        });

    },

    /**
     * Returns an iterator for the values.
     *
     * @return {Object}
     *         Iterator value.
     */
    values: function () {

        return makeIterator(this, function (list, index) {
            return list[index];
        });

    }

});

if (window.Symbol && Symbol.iterator) {
    ARIA.List.prototype[Symbol.iterator] = ARIA.List.prototype.values;
}

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
        return ARIA.getById(this.getAttribute());
    },

    /**
     * Checks to see if attribute is set and the element referenced by the
     * attribute exists, returning true if both are true.
     *
     * @return {Boolean}
     *         true if the attribute exists and references an existing element,
     *         false otherwise.
     */
    has: function () {
        return this.hasAttribute() && this.get() !== null;
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
ARIA.ReferenceList = ARIA.createClass(ARIA.List, {

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
        } else if (typeof value === "string" || ARIA.isNode(value)) {
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
        return this.toArray(ARIA.getById);
    },

    /**
     * Checks to see either if the attribute exists and all elements exist or,
     * if a parameter is passed, whether or not that item appears within the
     * list.
     *
     * @param  {Element|String} [item]
     *         Optional item to check for.
     * @return {Boolean}
     *         true if the attribute exists and all elements exist or, if a
     *         parameter is passed, true if the list contains the value.
     */
    has: function (item) {

        return this.hasAttribute() && (
            item === undefined
            ? this.get().filter(Boolean).length === this.length
            : this.contains(item)
        );

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
        this.manipulationFlags = Object.create(null);

        this.preloadAttributes();
        this.readAttributes();
        this.observeAttributes();

    },

    /**
     * Creates placeholders for all the WAI-ARIA attributes that are in
     * {@link ARIA.factories}. The factories are lazy-loaded so they're only
     * instantiated as needed.
     */
    preloadAttributes: function () {

        Object.keys(ARIA.factories).forEach(function (attribute) {

            var value;

            Object.defineProperty(this, attribute, {

                get: function () {

                    if (!value) {

                        value = ARIA.runFactory(
                            attribute,
                            this.element,
                            ARIA.normalise(attribute)
                        );

                    }

                    return value;

                },

                set: function (value) {
                    this[attribute].set(value);
                }

            });

        }, this);


    },

    /**
     * Reads all teh WAI-ARIA attributes on {@link ARIA.Element#element} and
     * sets the {@link ARIA.Property} values.
     */
    readAttributes: function () {

        var hasOwnProperty = Object.prototype.hasOwnProperty;

        arrayFrom(this.element.attributes, function (attribute) {

            var name = attribute.name.replace(/^aria\-/, "");

            if (hasOwnProperty.call(this, name)) {
                this[name].set(attribute.value);
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
        var element = that.element;
        var observer = new MutationObserver(function (mutations) {
console.log("%cSomething happened to %o - mutations = %o", "background-color:#fcc;font-weight:bold", element, mutations);
            mutations.forEach(function (mutation) {

                var attribute = mutation.attributeName || "";
                var suffix = attribute.slice(5);
                var value;
                var old;
console.log("%cmutation.type = %o, suffix = %o, factories = %o, flag = %o, hasAttribute = %o, getAttribute = %o, element = %o", "background-color:#fcc", mutation.type, suffix, ARIA.factories[suffix] ? "found": "NOT FOUND", that.manipulationFlags[suffix], element.hasAttribute(attribute), element.getAttribute(attribute), element);
                if (
                    mutation.type === "attributes"
                    && ARIA.factories[suffix]
                    && !that.manipulationFlags[suffix]
                ) {

                    that.manipulationFlags[suffix] = true;

                    if (element.hasAttribute(attribute)) {

                        value = ARIA.Property.interpret(
                            element.getAttribute(attribute)
                        );
                        old = ARIA.Property.interpret(mutation.oldValue);

console.log("%cattribute %o (%o) on %o changed from %o to %o", "background-color:#fcc", attribute, suffix, element, old, value);
                        if (value !== old) {
                            // that[suffix].set(value);
                        }

                    } else {
                        // that[suffix].remove();
                    }

                    window.setTimeout(function () {
                        delete that.manipulationFlags[suffix];
                    }, 0);

                }

            });

        });

        observer.observe(element, {
            attributes: true,
            attributeOldValue: true
        });

        /**
         * The observer.
         * @type {MutationObserver}
         */
        that.observer = observer;

    },

    /**
     * Disconnects {@link ARIA.Element#observer}.
     */
    disconnectAttributes: function () {
        this.observer.disconnect();
    }

});

var makeFactory = function (Constructor, tokens, pattern) {

    return function (element, attribute) {

        var property = new Constructor(element, attribute);

        if (tokens && tokens.length) {
            property.setTokens(tokens);
        }

        if (pattern) {
            property.setPattern(pattern);
        }

        return property;

    };

};

var AriaProperty = ARIA.Property;
var AriaList = ARIA.List;
var factoryEntries = [
    [AriaProperty, [
        "keyshortcuts",
        "label",
        "placeholder",
        "roledescription",
        "valuetext"
    ]],
    // [AriaList, [
    //     "role"
    // ]],
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
    [AriaProperty, [
        "colcount",
        "colindex",
        "colspan",
        "level",
        "posinset",
        "rowcount",
        "rowindex",
        "rowspan",
        "setsize"
    ], undefined, /^\d+$/],
    [AriaProperty, [
        "valuemax",
        "valuemin",
        "valuenow"
    ], undefined, /^(\d+(\.\d+)?)|\.\d+$/],
    [AriaProperty, ["autocomplete"], [
        "none",
        "inline",
        "list",
        "both"
    ]],
    [AriaProperty, ["current"], [
        "false",
        "true",
        "page",
        "step",
        "location",
        "date",
        "time"
    ]],
    [AriaProperty, ["haspopup"], [
        "false",
        "true",
        "menu",
        "listbox",
        "tree",
        "grid",
        "dialog"
    ]],
    [AriaProperty, ["invalid"], [
        "false",
        "true",
        "grammar",
        "spelling"
    ]],
    [AriaProperty, ["live"], [
        "off",
        "assertive",
        "polite"
    ]],
    [AriaProperty, ["orientation"], [
        undefined,
        "undefined",
        "horizontal",
        "vertical"
    ]],
    [AriaProperty, ["sort"], [
        "none",
        "ascending",
        "descending",
        "other"
    ]],
    [AriaList, ["dropeffect"], [
        "none",
        "copy",
        "execute",
        "link",
        "move",
        "popup"
    ]],
    [AriaList, ["relevant"], [
        "additions",
        "all",
        "removals",
        "text"
    ]]
];

factoryEntries.forEach(function (entry) {

    entry[1].forEach(function (property) {
        ARIA.factories[property] = makeFactory(entry[0], entry[2], entry[3]);
    });

});

ARIA.addAlias("labelledby", "labeledby");

// https://github.com/LeaVerou/bliss/issues/49
function addNodeProperty(name, valueMaker) {

    Object.defineProperty(Node.prototype, name, {

        configurable: true,

        get: function getter() {

            Object.defineProperty(Node.prototype, name, {
                get: undefined
            });

            Object.defineProperty(this, name, {
                value: valueMaker(this)
            });

            Object.defineProperty(Node.prototype, name, {
                get: getter
            });

            return this[name];

        }

    });

}

addNodeProperty("aria", function (context) {
    return new ARIA.Element(context);
});

addNodeProperty("role", function (context) {
    return new AriaList(context, "role");
});

globalVariable.ARIA = ARIA;
}(window));
//# sourceMappingURL=aria.js.map
