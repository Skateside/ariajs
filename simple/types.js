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
