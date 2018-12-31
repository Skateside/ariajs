/*! ariajs - v0.2.0 - MIT license - https://github.com/Skateside/ariajs - 2018-12-31 */
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
 * Memoises a function so that the cached values are returned if they exist.
 *
 * @param  {Function} func
 *         Function to cache,
 * @param  {Function} [keyMaker]
 *         Optional function to create the cache's key.
 * @param  {Object} [cache]
 *         Optional cache for the function.
 * @return {Function}
 *         Memoised function.
 */
ARIA.memoize = function (func, keyMaker, cache) {

    var context = this;

    if (cache === undefined) {
        cache = Object.create(null);
    }

    if (keyMaker === undefined) {
        keyMaker = stringifyArguments;
    }

    return function () {

        var args = slice(arguments);
        var key = keyMaker.apply(context, args);
        var response = cache[key];

        if (!owns(cache, key)) {

            response = func.apply(context, args);
            cache[key] = response;

        }

        return response;

    };

};

/**
 * The cache for {@link ARIA.addPrefix}. See also {@link ARIA.translate}.
 * @type {Object}
 */
ARIA.prefixCache = Object.create(null);

/**
 * The cache for {@link ARIA.removePrefix}.
 * @type {Object}
 */
ARIA.suffixCache = Object.create(null);

/**
 * Translations for after the {@link ARIA.addPrefix} process has happened.
 * Unlike {@link ARIA.prefixCache}, this map translates values that have already
 * been processed (trimmed and converted into lower-case). As such, it's
 * probably easier to modify this map than the cache.
 * @type {Object}
 */
ARIA.translate = objectAssign(Object.create(null), {
    "labeledby": "aria-labelledby",
    "role": "role"
});

/**
 * Translations for afgter the {@link ARIA.removePrefix} process has happened.
 * Unlike {@link ARIA.suffixCache}, this map translates values that have already
 * been process (trimmed and converted into lower-case). As such, it's probably
 * easier to modify this map than the cache.
 * @type {Object}
 */
ARIA.untranslate = Object.create(null);

/**
 * The regular expression used to match the WAI-ARIA prefix.
 * @type {RegExp}
 */
ARIA.PREFIX_REGEXP = (/^(aria\-)?/);

/**
 * Adds the WAI-ARIA prefix to the given attribute if it doesn't already have
 * it.
 *
 * @function
 * @param    {String} attribute
 *           Attribute that should be prefixed with "aria-", if it isn't
 *           already.
 */
ARIA.addPrefix = ARIA.memoize(
    function (attribute) {

        var removed = ARIA.removePrefix(attribute);

        return ARIA.translate[removed] || ("aria-" + removed);

    },
    identity,
    ARIA.prefixCache
);

/**
 * Removes the WAI-ARIA prefix from the given attribute if it has it.
 *
 * @function
 * @param    {String} attribute
 *           Attribute that should have the "aria-" prefix removed.
 */
ARIA.removePrefix = ARIA.memoize(
    function (attribute) {

        var normalised = interpretLowerString(attribute);

        return (
            ARIA.untranslate(normalised)
            || normalised.replace(ARIA.PREFIX_REGEXP, "")
        );

    },
    identity,
    ARIA.suffixCache
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
 * A map for keeping all dummy elements in {@link ARIA.Observer}.
 * @private
 * @type {WeakMap}
 */
var observerMap = new WeakMap();

/**
 * Creates observers.
 *
 * @class ARIA.Observer
 */
ARIA.Observer = ARIA.createClass(/** @lends ARIA.Observer.prototype */{

    /**
     * Gets the element that will dispatch events for this observer.
     *
     * @return {Element}
     *         Element that will dispatch events.
     */
    getEventElement: function () {

        var dummy = observerMap.get(this);

        if (!dummy) {

            dummy = document.createElement("div");
            observerMap.set(this, dummy);

        }

        return dummy;

    },

    /**
     * Creates a custom event.
     *
     * @param  {String} name
     *         Name of the event to create.
     * @param  {?} [detail]
     *         Optional detail to be passed to the event.
     * @return {CustomEvent}
     *         Custom event.
     */
    createEvent: function (name, detail) {

        return new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail: detail
        });

    },

    /**
     * Dispatches the given event on the element that comes from
     * {@link ARIA.Observer#getEventElement}. If the event parameter is a
     * string, it is passed to {@link ARIA.Observer#createEvent}.
     *
     * @param  {Event|string} event
     *         Either the event to dispatch or the name of the event to
     *         dispatch.
     * @param  {?} [detail]
     *         Optional detail for the event. This is only used if the event
     *         parameter is a string.
     * @return {Event}
     *         The event that was dispatched.
     */
    dispatchEvent: function (event, detail) {

        if (typeof event === "string") {
            event = this.createEvent(event, detail);
        }

        this.getEventElement().dispatchEvent(event);

        return event;

    },

    /**
     * Adds an event listener to the element that comes from
     * {@link ARIA.Observer#getEventElement}.
     *
     * @param {String} name
     *        Name of the event to which a listener should be added.
     * @param {Function} handler
     *        Function to execute when the event is dispatched.
     */
    addEventListener: function (name, handler) {
        this.getEventElement().addEventListener(name, handler);
    },

    /**
     * Removes an event listener from the element that comes from
     * {@link ARIA.Observer#getEventElement}.
     *
     * @param {String} name
     *        Name of the event from which a listener should be removed.
     * @param {Function} handler
     *        Function to remove from the event listener.
     */
    removeEventListener: function (name, handler) {
        this.getEventElement().removeEventListener(name, handler);
    }

});

// Create a fall-back for browsers that don't allow CustomEvent to be used as a
// constructor.
try {

    var event = new CustomEvent("my-custom-event", {
        bubbles: true,
        cancelable: true,
        detail: {}
    });

} catch (ignore) {

    ARIA.Observer.prototype.createEvent = function (name, detail) {

        var event = document.createEvent("CustomEvent");

        event.initCustomEvent(name, true, true, detail);

        return event;

    };

}

/**
 * Instance of {@link ARIA.Observer} that is used by {@link ARIA.trigger},
 * {@link ARIA.on} and {@link ARIA.off}.
 * @type {ARIA.Observer}
 */
ARIA.observer = new ARIA.Observer();

/**
 * Dispatches an event with {@link ARIA.observer}.
 *
 * @param  {String} name
 *         Name of the event to dispatch.
 * @param  {?} [detail]
 *         Optional detail for the event.
 * @return {Event}
 *         Event that was dispatched.
 */
ARIA.trigger = function (name, detail) {
    return ARIA.observer.dispatchEvent(name, detail);
};

/**
 * Adds a handler to the given event.
 *
 * @param {String} name
 *        Name of the event to listen for.
 * @param {Function} handler
 *        Handler to execute when the event is dispatched.
 */
ARIA.on = function (name, handler) {
    ARIA.observer.addEventListener(name, handler);
};

/**
 * Revmoes a handler from the given event.
 *
 * @param {String} name
 *        Name of the event to stop listening to.
 * @param {Function} handler
 *        Handler to remove from the event.
 */
ARIA.off = function (name, handler) {
    ARIA.observer.removeEventListener(name, handler);
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
     * Helper function for dispatching an event using {@link ARIA.trigger} which
     * automatically passes {@link ARIA.Property#element} and
     * {@link ARIA.Property#attribute} to the event details.
     *
     * @param  {String} event
     *         Name of the event to dispatch.
     * @param  {Object} [detail]
     *         Optional additional details.
     * @return {Event}
     *         Dispatched event.
     */
    trigger: function (event, detail) {

        return ARIA.trigger(event, objectAssign({
            element: this.element,
            attribute: this.attribute
        }, detail));

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element} and interprets it (see
     * {@link ARIA.Property#interpret}) before returning it. If the element
     * doesn't have the attribute, null is returned.
     *
     * @return {String|null}
     *         Interpretted value of {@link ARIA.Property#attribute} or null if
     *         the attribute is not set.
     * @fires  ARIA.Property#preget
     * @fires  ARIA.Property#postget
     */
    get: function () {

        var preEvent = this.trigger(ARIA.EVENT_PRE_GET);
        var element = this.element;
        var attribute = this.attribute;
        var value;

        if (!preEvent.defaultPrevented) {

            value = (
                ARIA.hasAttribute(element, attribute)
                ? this.interpret(ARIA.getAttribute(element, attribute))
                : null
            );
            this.trigger(ARIA.EVENT_POST_GET, {
                value: value
            });

        }

        return value;

    },

    /**
     * Sets the value of {@link ARIA.Property#attribute} on
     * {@link ARIA.Property#element} to the given value once it's been
     * interpretted (see {@link ARIA.Property#interpret}). If the value is
     * interpretted as an empty string, the attribute is removed using
     * {@link ARIA.Property#remove}.
     *
     * @param {?} value
     *        Value to set.
     * @fires ARIA.Property#preset
     * @fires ARIA.Property#postset
     */
    set: function (value) {

        var interpretted = this.interpret(value);
        var eventData = {
            raw: value,
            value: interpretted
        };
        var preEvent = this.trigger(ARIA.EVENT_PRE_SET, eventData);

        if (!preEvent.defaultPrevented) {

            if (interpretted === "") {
                this.remove();
            } else {
                ARIA.setAttribute(this.element, this.attribute, interpretted);
            }

            this.trigger(ARIA.EVENT_POST_SET, eventData);

        }

    },

    /**
     * Removes {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element}.
     *
     * @fires ARIA.Property#preremove
     * @fires ARIA.Property#postremove
     */
    remove: function () {

        var preEvent = this.trigger(ARIA.EVENT_PRE_REMOVE);

        if (!preEvent.defaultPrevented) {

            ARIA.removeAttribute(this.element, this.attribute);
            this.trigger(ARIA.EVENT_POST_REMOVE);

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
ARIA.Property.interpret = interpretString;

/**
 * Name of the {@link ARIA.Property#preset} event.
 * @type {String}
 */
ARIA.EVENT_PRE_SET = "ariajs-pre-set";
/**
 * Event triggered before setting a WAI-ARIA property with
 * {@link ARIA.Property#set}. If the default action of this event is prevented,
 * the value is not set.
 *
 * @event    ARIA.Property#preset
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element that will have the attribute value set.
 * @property {String} detail.attribute
 *           Name of the attribute that will be set.
 * @property {String} detail.raw
 *           Raw value for to set on the value.
 * @property {Array<Element>|Array<String>|Element|Number|String} detail.value
 *           Version of the value after it has been passed through
 *           {@link ARIA.Property#interpret}. This is the value that will be set
 *           on the attribute.
 */

/**
 * Name of the {@link ARIA.Property#postset} event.
 * @type {String}
 */
ARIA.EVENT_POST_SET = "ariajs-post-set";
/**
 * Event triggered after setting a WAI-ARIA property with
 * {@link ARIA.Property#set}.
 *
 * @event    ARIA.Property#postset
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element that had the attribute value set.
 * @property {String} detail.attribute
 *           Name of the attribute that was set.
 * @property {String} detail.raw
 *           Raw value of the attribute.
 * @property {Array<Element>|Array<String>|Element|Number|String} detail.value
 *           Version of the value after it has been passed through
 *           {@link ARIA.Property#interpret}.
 */

/**
 * Name of the {@link ARIA.Property#preget} event.
 * @type {String}
 */
ARIA.EVENT_PRE_GET = "ariajs-pre-get";
/**
 * Event triggered before getting a WAI-ARIA property with
 * {@link ARIA.Property#get}. If the default action of this event is prevented,
 * the value is not retrieved.
 *
 * @event    ARIA.Property#preget
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute value should be retrieved.
 * @property {String} detail.attribute
 *           Name of the attribute whose value should be retrieved.
 */

/**
 * Name of the {@link ARIA.Property#postget} event.
 * @type {String}
 */
ARIA.EVENT_POST_GET = "ariajs-post-get";
/**
 * Event triggered before getting a WAI-ARIA property with
 * {@link ARIA.Property#get}.
 *
 * @event    ARIA.Property#postget
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute value should be retrieved.
 * @property {String} detail.attribute
 *           Name of the attribute whose value should be retrieved.
 * @property {?} detail.value
 *           The value of the attribute after being passed through
 *           {@link ARIA.Property#interpret}. If the element does not have the
 *           attribute, this value will be null.
 */

/**
 * Name of the {@link ARIA.Property#preremove} event.
 * @type {String}
 */
ARIA.EVENT_PRE_REMOVE = "ariajs-pre-remove";
/**
 * Event triggered before removing a WAI-ARIA attribute using
 * {@link ARIA.Property#remove}. If the default is prevented, the attribute is
 * not removed.
 *
 * @event    ARIA.Property#preremove
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute should be removed.
 * @property {String} detail.attribute
 *           Name of the attribute to remove.
 */

/**
 * Name of the {@link ARIA.Property#postremove} event.
 * @type {String}
 */
ARIA.EVENT_POST_REMOVE = "ariajs-post-remove";
/**
 * Event triggered after removing a WAI-ARIA attribute using
 * {@link ARIA.Property#remove}.
 *
 * @event    ARIA.Property#postremove
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute should be removed.
 * @property {String} detail.attribute
 *           Name of the attribute to remove.
 */

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
    init: function (element, attribute) {

        /**
         * The list of values.
         * @type {Array.<String>}
         */
        this.list = [];

        this.$super(element, attribute);

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
     * interpretted as an array (see {@link ARIA.List#interpret}). If the values
     * are interpretted as empty array, the attribute is removed using
     * {@link ARIA.Property#remove}. Only unique values are added (see
     * {@link ARIA.arrayUnique}).
     *
     * @param {?} value
     *        Value(s) to add. If the given value is a string, it is assumed to
     *        be a space-separated list.
     * @fires ARIA.Property#preset
     * @fires ARIA.Property#postset
     */
    set: function (value) {

        var that = this;
        var values = arrayUnique(that.interpret(value));
        var eventData = {
            raw: value,
            value: values
        };
        var preEvent = this.trigger(ARIA.EVENT_PRE_SET, eventData);

        if (!preEvent.defaultPrevented) {

            that.list = values;

            if (values.length) {

                ARIA.setAttribute(
                    this.element,
                    this.attribute,
                    values.join(" ")
                );

            } else {
                this.remove();
            }

            this.trigger(ARIA.EVENT_POST_SET, eventData);

        }

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} as an array. Modifying
     * the array will not affect the attribute.
     *
     * @param  {Function} [map]
     *         Optional mapping function for converting the results.
     * @return {Array.<String>}
     *         Value of the attribute as an array.
     * @fires  ARIA.Property#preget
     * @fires  ARIA.Property#postget
     */
    get: function (map) {

        var preEvent = this.trigger(ARIA.EVENT_PRE_GET);
        var list = [];

        if (!preEvent.defaultPrevented) {

            list = arrayFrom(this.list, map);
            this.trigger(ARIA.EVENT_POST_GET, {
                value: list
            });

        }

        return list;

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
        return this.$super(ARIA.getById);
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
         * Instances of {@link ARIA.Property} (or sub-classes) that are used to
         * check get and set values.
         * @type {Object}
         */
        this.instances = Object.create(null);

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

                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set#Return_value
                return true;

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
            var suffix = ARIA.removePrefix(attribute);
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

                                if (owns(that, attribute)) {

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
        || ARIA.factories[ARIA.removePrefix(attribute)]
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
 * @return {Function}
 *         A factory function that takes the element and returns the instance.
 */
ARIA.makeFactory = function (attribute, Constructor) {

    return function (element) {
        return new Constructor(element, attribute);
    };

};

/**
 * All the factory entries that create the {@link ARIA.factories}. Each entry is
 * an array of two values: the {@link ARIA.Property} (or sub-class) constructor
 * and an array of the WAI-ARIA attribute suffixes (see {@link ARIA.removePrefix}).
 * @type {Array.<Array>}
 */
ARIA.factoryEntries = [
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

/**
 * Creates the {@link ARIA.factories} based on {@link ARIA.factoryEntries}. As a
 * public function, this can be re-called if a plugin modifies
 * {@link ARIA.makeFactory}.
 */
ARIA.createFactories = function () {

    ARIA.factoryEntries.forEach(function (entry) {

        entry[1].forEach(function (attribute) {

            ARIA.factories[attribute] = ARIA.makeFactory(
                ARIA.addPrefix(attribute),
                entry[0]
            );

        });

    });

};

// Make initial factories.
ARIA.createFactories();

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

    var suffix = ARIA.removePrefix(source);

    if (!Array.isArray(aliases)) {
        aliases = [aliases];
    }

    if (!ARIA.getFactory(suffix)) {

        throw new ReferenceError(
            "ARIA.factories."
            + suffix
            + " does not exist"
        );

    }

    aliases.forEach(function (alias) {

        var normalAlias = ARIA.removePrefix(alias);

        ARIA.translate[normalAlias] = suffix;
        ARIA.factories[normalAlias] = ARIA.factories[suffix];

    });

};

ARIA.addAlias("labelledby", "labeledby");
}(window));
//# sourceMappingURL=aria.js.map
