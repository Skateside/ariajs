/*! ariajs - v0.5.0 - MIT license - https://github.com/Skateside/ariajs - 2021-08-26 */
(function (globalVariable) {
    "use strict";

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

/**
 * Creates the WAI-ARIA properties for the given element. See {@link Aria#init}
 * for the signature.
 *
 * @constructor
 */
function Aria() {
    return this.init.apply(this, arguments);
}

/**
 * The current version of this library, in semver.
 * @memberof Aria
 * @name VERSION
 * @type {String}
 */
Object.defineProperty(Aria, "VERSION", {
    get: function () {
        return "0.5.0";
    }
});

/**
 * A counter that ensures that all ID's created by {@link Aria.identify} are
 * unique.
 * @private
 * @type {Number}
 */
var identifyCounter = 0;

assign(Aria, /** @lends Aria */{

    /**
     * Each of the types that can be used.
     * @type {Object}
     */
    types: {},

    /**
     * Information for each of the properties that the instance will use.
     * @type {Object}
     */
    properties: {},

    /**
     * Prefixes the given property so that it starts with "aria-".
     *
     * @param  {String} property
     *         Property to prefix.
     * @return {String}
     *         Prefixed property.
     */
    prefix: function (property) {

        var prefixed = interpretString(property).toLowerCase();
        var prefix = "aria-";

        return (
            prefixed.startsWith(prefix)
            ? prefixed
            : (prefix + prefixed)
        );

    },

    /**
     * Removes the "aria-" prefix from the given property.
     *
     * @param  {String} property
     *         Property whose prefix should be removed.
     * @return {String}
     *         Property without the prefix.
     */
    unprefix: function (property) {

        var unprefixed = interpretString(property).toLowerCase();
        var prefix = "aria-";

        return (
            unprefixed.startsWith(prefix)
            ? unprefixed.slice(prefix.length)
            : unprefixed
        );

    },

    /**
     * Adds the given type to {@link Aria.types}.
     *
     * @param {String} name
     *        Name of the type to add.
     * @param {Object} type
     *        Type to add.
     */
    addType: function (name, type) {
        this.types[name] = type;
    },

    /**
     * Adds the property type.
     *
     * @param {String} property
     *        Name of the property type to add.
     * @param {Object} type
     *        Type for the property.
     * @param {String} [attribute]
     *        Optional attribute name. If ommitted, the property name is passed
     *        to {@link Aria.prefix} and that result is used.
     */
    addProperty: function (property, type, attribute) {

        if (attribute === undefined) {
            attribute = this.prefix(property);
        }

        this.properties[property] = {
            type: type,
            name: attribute
        };
        this.duplicateProperty(property);

    },

    /**
     * Duplicates the property in {@link Aria.properties} so that both a
     * prefixed and unprefixed version exist. This allow the either to be used.
     *
     * This method is only necessary in builds that don't include the proxy
     * plugin and environments that understand Proxy.
     *
     * @param {String} property
     *        Property in {@link Aria.properties} that should be duplicated.
     */
    duplicateProperty: function (property) {

        var prefixed = this.prefix(property);
        var unprefixed = this.unprefix(property);
        var source = this.properties[property];

        this.properties[prefixed] = source;
        this.properties[unprefixed] = source;

    },

    /**
     * Returns the give element's ID. If the element doesn't have an ID, a
     * unique one is generated and assigned before being returned.
     *
     * @param  {Element} element
     *         Element whose ID should be returned.
     * @return {String}
     *         Element's ID.
     */
    identify: function (element) {

        var id = element.id;

        if (id) {
            return id;
        }

        do {

            id = "ariajs-" + identifyCounter;
            identifyCounter += 1;

        } while (document.getElementById(id));

        element.id = id;

        return id;

    },

    /**
     * The get trap that Proxy will use. If the property is recognised as a type
     * (see {@link Aria#getProperty}) then it's passed to {@link Aria#read}. If
     * the property isn't recognised, the target's property is returned (which
     * may be undefined).
     *
     * @param  {Object} target
     *         Instance whose property should be accessed.
     * @param  {String} property
     *         Name of the property to access.
     * @return {?}
     *         Target's property or the result of reading property type.
     */
    getTrap: function (target, property) {

        var type = target.getProperty(property);

        if (type) {
            return target.read(type);
        }

        return target[property];

    },

    /**
     * The set trap that Proxy will use. If the property is recognised as a type
     * (see {@link Aria#getProperty}) then the value is passed to
     * {@link Aria#write}. If the property isn't recognised, it's simply set on
     * the target.
     *
     * @param  {Object} target
     *         Instance whose property should be set.
     * @param  {String} property
     *         Property to set.
     * @param  {?} value
     *         Value to set.
     * @return {Boolean}
     *         true.
     */
    setTrap: function (target, property, value) {

        var type = target.getProperty(property);

        if (type) {
            target.write(type, value);
        } else {
            target[property] = value;
        }

        return true;

    }

});

Aria.prototype = {

    /**
     * Constructs {@link Aria}.
     *
     * @constructs Aria
     * @param      {Element} element
     *             Element whose WAI-ARIA attributes should be handled.
     */
    init: function (element) {

        /**
         * Element that this instance is affecting.
         * @type {Element}
         */
        this.element = element;

        return this.makeProperties(this);

    },

    /**
     * Creates the properties for this instance.
     *
     * @param  {Aria} context
     *         Instance that will gain the properties.
     * @return {Aria}
     *         The instance that gained the properties.
     */
    makeProperties: function (context) {

        var properties = Aria.properties;

        Object.keys(properties).forEach(function (property) {

            var data = properties[property];

            Object.defineProperty(context, property, {

                get: function () {
                    return Aria.getTrap(context, property);
                },

                set: function (value) {
                    return Aria.setTrap(context, property, value);
                }

            });

        });

        return context;

    },

    /**
     * Gets the property from {@link Aria.properties}.
     *
     * @param  {String} property
     *         Property to access.
     * @return {Object|undefined}
     *         Property type or undefined if the type doesn't exist.
     */
    getProperty: function (property) {
        return Aria.properties[property];
    },

    /**
     * Passes the attribute's value to the given property's read method. The
     * value will be null if the attribute isn't set on {@link Aria#element}.
     *
     * @param  {Object} property
     *         Property that will read the attribute's value and define the
     *         attribute's name.
     * @return {?}
     *         Result of reading the property.
     */
    read: function (property) {
        return property.type.read(this.element.getAttribute(property.name));
    },

    /**
     * Writes the attribute's value after passing it to the given property's
     * write method. If the result from the property's write method is an empty
     * string, the property is passed to {@link Aria#delete}; if not, the
     * attribute is set on {@link Aria#element}.
     *
     * @param {Object} property
     *        Property that will write the attribute's value and define the
     *        attribute's name.
     * @param {?} value
     *        Value to write.
     */
    write: function (property, value) {

        var writable = property.type.write(value);

        if (writable !== "") {
            this.element.setAttribute(property.name, writable);
        } else {
            this.delete(property);
        }

    },

    /**
     * Removes the property's attribute from {@link Aria#element}.
     *
     * @param {Object} property
     *        Type that will define the attribute name to remove.
     */
    delete: function (property) {
        this.element.removeAttribute(property.name);
    }

}

// Expose the Aria constructor.
globalVariable.Aria = Aria;

var addType = Aria.addType.bind(Aria);
var types = Aria.types;

/**
 * The base type from which all types come.
 * @type {Object}
 * @name basic
 * @memberof Aria.types
 */
var basicType = {

    /**
     * Coerces the given value to make sure it's a string. null and
     * undefined are converted into an empty string.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {String}
     *         String based on the given value.
     */
    coerce: function (value) {
        return interpretString(value);
    },

    /**
     * Reads the value from the element's attribute and coerces it as
     * necessary.
     *
     * @param  {String|null} value
     *         The element's attribute value.
     * @return {String}
     *         The coerced value.
     */
    read: function (value) {
        return this.coerce(value);
    },

    /**
     * Converts the value so it can be written to the element.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {String}
     *         The value to write to the element's attribute.
     */
    write: function (value) {
        return this.coerce(value);
    }

};

addType("basic", basicType);

/**
 * The float type handles numbers with decimals.
 * @type {Object}
 * @extends Aria.types.basic
 * @name float
 * @memberof Aria.types
 */
var floatType = extend(basicType, /** @lends floatType */{

    /**
     * Read the float value from the attribute.
     *
     * @param  {String|null} value
     *         Attribute balue to convert.
     * @return {Number}
     *         Converted float. This may be NaN if the attribute doesn't convert
     *         into a number correctly.
     */
    read: function (value) {
        return Number(types.basic.read(value));
    },

    /**
     * Converts non numeric values into an empty string.
     *
     * @param  {?} value
     *         Value to write.
     * @return {String}
     *         Numeric string.
     */
    write: function (value) {

        return (
            Number.isNaN(Number(value))
            ? ""
            : value
        );

    }

});

addType("float", floatType);

/**
 * A version of {@link floatType} that will drop the decimal.
 * @type {Object}
 * @extends Aria.types.float
 * @name integer
 * @memberof Aria.types
 */
var integerType = extend(floatType, /** @lends integerType */{

    /**
     * Reads the integer value.
     *
     * @param  {String|null} value
     *         Attribute value.
     * @return {Number}
     *         Numeric version of the value.
     */
    read: function (value) {
        return Math.floor(types.float.read(value));
    },

    /**
     * Drops the decimal from the given value, coercing non numeric values to an
     * empty string.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {String}
     *         Numeric string.
     */
    write: function (value) {
        return types.float.write(Math.floor(value));
    }

});

addType("integer", integerType);

/**
 * Handles boolean values.
 * @type {Object}
 * @extends Aria.types.basic
 * @name state
 * @memberof Aria.types
 */
var stateType = extend(basicType, /** @lends stateType */{

    /**
     * Coerces the given value into a boolean.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {Boolean}
     *         Coerced value.
     */
    coerce: function (value) {

        var coerced = types.basic.coerce(value);

        if (coerced === "") {
            return false;
        }

        return (/^true$/i).test(coerced);

    },

    /**
     * Reads the value as a boolean.
     *
     * @param  {String|null} value
     *         Attribute value.
     * @return {Boolean}
     *         Boolean value.
     */
    read: function (value) {
        return this.coerce(value);
    },

    /**
     * Writes the given value as a boolean.
     *
     * @param  {?} value
     *         Value to write.
     * @return {String}
     *         Either an empty string, "true" or "false".
     */
    write: function (value) {

        if (value === "") {
            return value;
        }

        return (
            value
            ? "true"
            : "false"
        );

    }

});

addType("state", stateType);

/**
 * true, false or "mixed".
 * @extends Aria.types.state
 * @type {Object}
 * @name tristate
 * @memberof Aria.types
 */
var tristateType = extend(stateType, /** @lends tristateType */{

    /**
     * Coerces the value into a boolean or "mixed".
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {Boolean|String}
     *         Either a boolean or "mixed".
     */
    coerce: function (value) {

        return (
            value === "mixed"
            ? value
            : types.state.coerce(value)
        );

    },

    /**
     * Rwads the value from the attribute.
     *
     * @param  {String|null} value
     *         Value to read.
     * @return {Boolean|String}
     *         Boolean or "mixed".
     */
    read: function (value) {

        var coerced = this.coerce(value);

        return (
            coerced === "mixed"
            ? coerced
            : types.state.read(value)
        );

    },

    /**
     * Writes the value for the attribute.
     *
     * @param  {?} value
     *         Value to write.
     * @return {String}
     *         Value to write to the attribute.
     */
    write: function (value) {

        return (
            value === "mixed"
            ? value
            : types.state.write(value)
        );

    }

});

addType("tristate", tristateType);

/**
 * true, false or undefined
 * @extends Aria.types.state
 * @type {Object}
 * @name undefinedState
 * @memberof Aria.types
 */
var undefinedStateType = extend(stateType, /** @lends undefinedStateType */{

    /**
     * Coerves the value to true, false or undefined.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {[Boolean|undefined]}
     *         Boolean or undefined.
     */
    coerce: function (value) {

        return (
            // Coerce null to undefined because getAttribute() will return null
            // if the attribute isn't set.
            (value === "" || (/^undefined$/i).test(value) || value === null)
            ? undefined
            : types.state.coerce(value)
        );

    },

    /**
     * Reads and interprets the attribute value.
     *
     * @param  {String|null} value
     *         Attribute vaule.
     * @return {Boolean|undefined}
     *         Boolean or undefined.
     */
    read: function (value) {
        return this.coerce(value);
    },

    /**
     * Writes the value to the attribute.
     *
     * @param  {?} value
     *         Value to write.
     * @return {String}
     *         Value that will be written to the attribute.
     */
    write: function (value) {

        return (
            (value === undefined || value === "undefined")
            ? "undefined"
            : types.state.write(value)
        );

    }

});

addType("undefinedState", undefinedStateType);

/**
 * Handles references to other elements.
 * @extends Aria.types.basic
 * @type {Object}
 * @name reference
 * @memberof Aria.types
 */
var referenceType = extend(basicType, /** @lends referenceType */{

    /**
     * Converts the given value into an element reference.
     *
     * @param  {String|null} value
     *         Value to interpret.
     * @return {Element|null}
     *         Either the reference or null if the element cannot be found.
     */
    read: function (value) {
        return document.getElementById(types.basic.read(value));
    },

    /**
     * Writes the value to the attribute. If the value is an element then it's
     * passed through {@link Aria.identify}.
     *
     * @param  {?} value
               Value to write.
     * @return {String}
     *         Value for the attribute.
     */
    write: function (value) {

        if (value instanceof Element) {
            value = Aria.identify(value);
        }

        return types.basic.write(value);

    }

});

addType("reference", referenceType);

/**
 * A list type, that handles a space-separated attribute value.
 * @extends Aria.types.basic
 * @type {Object}
 * @name list
 * @memberof Aria.types
 */
var listType = extend(basicType, /** @lends listType */{

    /**
     * The type that will understand each entry in the space-separated value.
     * @type {Object}
     */
    type: Aria.types.basic,

    /**
     * Reads the attribute value as an array.
     *
     * @param  {String|null} value
     *         Attribute value.
     * @return {Array}
     *         An array. The array items will depend on {@link listType.type}.
     */
    read: function (value) {

        return this
            .asArray(value)
            .map(function (item) {
                return this.type.read(item);
            }, this);

    },

    /**
     * Writes the value to the attribute.
     *
     * @param  {?} value
     *         Value to write, probably an array of values.
     * @return {String}
     *         Value to write to the attribute.
     */
    write: function (value) {

        return this
            .asArray(value)
            .map(function (item) {
                return this.type.write(item);
            }, this)
            .filter(Boolean)
            .join(" ");

    },

    /**
     * Interprets the given value as an array.
     *
     * @param  {?} value
     *         Value to convert.
     * @return {Array}
     *         Array of items.
     */
    asArray: function (value) {

        if (value === null) {
            return [];
        }

        if (
            value
            && typeof value.length === "number"
            && typeof value !== "string"
        ) {
            return spread(value);
        }

        if (typeof value === "string") {

            value = value.trim();

            return (
                value === ""
                ? []
                : value.split(/\s+/)
            );

        }

        return [value];

    }

});

addType("list", listType);

/**
 * Handles a list of references.
 * @extends Aria.types.list
 * @type {Object}
 * @name referenceList
 * @memberof Aria.types
 */
var referenceListType = extend(listType, /** @lends referenceListType */{

    /**
     * @inheritDoc
     */
    type: Aria.types.reference

});

addType("referenceList", referenceListType);

var types = Aria.types;
var factoryEntries = [
    [types.basic, [
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
    [types.reference, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [types.referenceList, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [types.state, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [types.tristate, [
        "checked",
        "pressed"
    ]],
    [types.undefinedState, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [types.integer, [
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
    [types.float, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [types.list, [
        "dropeffect",
        "relevant"
    ]],
    [types.list, {
        role: "role"
    }]
];

factoryEntries.forEach(function (entry) {

    var type = entry[0];
    var properties = entry[1];

    if (Array.isArray(properties)) {

        properties.forEach(function (property) {
            Aria.addProperty(property, type);
        });

    } else if (properties && typeof properties === "object") {

        Object.entries(properties).forEach(function (propEntry) {
            Aria.addProperty(propEntry[0], type, propEntry[1]);
        });

    }

});
}(window));