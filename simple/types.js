/**
 * The base type from which all types come.
 * @type {Object}
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

/**
 * The float type handles numbers with decimals.
 * @type {Object}
 * @extends basicType
 */
var floatType = extend(basicType, {

    /**
     * [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    read: function (value) {
        return Number(basicType.read(value));
    },

    write: function (value) {

        return (
            Number.isNaN(Number(value))
            ? ""
            : value
        );

    }

});

var integerType = extend(floatType, {

    read: function (value) {
        return Math.floor(floatType.read(value));
    },

    write: function (value) {
        return floatType.write(Math.floor(value));
    }

});

var stateType = extend(basicType, {

    coerce: function (value) {

        var coerced = basicType.coerce(value);

        if (coerced === "") {
            return false;
        }

        return (/^true$/i).test(coerced);

    },

    read: function (value) {
        return this.coerce(value);
    },

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

var tristateType = extend(stateType, {

    read: function (value) {

        var coerced = this.coerce(value);

        return (
            coerced === "mixed"
            ? coerced
            : stateType.read(value)
        );

    },

    write: function (value) {

        return (
            value === "mixed"
            ? value
            : stateType.write(value)
        );

    }

});

var undefinedStateType = extend(stateType, {

    coerce: function (value) {

        return (
            (value === "" || (/^undefined$/i).test(value))
            ? undefined
            : stateType.coerce(value)
        );

    },

    read: function (value) {
        return this.coerce(value);
    }

});

var referenceType = extend(basicType, {

    read: function (value) {
        return document.getElementById(basicType.read(value));
    },

    write: function (value) {

        if (this.isElement(value)) {
            value = this.identify(value);
        }

        return basicType.write(value);

    },

    isElement: function (object) {
        return (object instanceof Element);
    },

    counter: 0,

    identify: function (element) {

        var id = element.id;

        if (id) {
            return id;
        }

        do {

            id = "anonymous-element-" + this.counter;
            this.counter += 1;

        } while (document.getElementById(id));

        element.id = id;

        return id;

    }

});

var listType = extend(basicType, {

    type: basicType,

    read: function (value) {

        var that = this;
        var coerced = basicType.coerce(value).trim();

        if (coerced === "") {
            return [];
        }

        return coerced
            .split(/\s+/)
            .map(function (item) {
                return that.type.read(item);
            });

    },

    write: function (value) {

        var that = this;

        if (typeof value === "string") {
            return value;
        }

        return this
            .asArray(value)
            .map(function (item) {
                return that.type.write(item);
            })
            .join(" ");

    },

    asArray: function (value) {

        if (
            value
            && typeof value.length === "number"
            && typeof value !== "string"
        ) {
            return spread(value);
        }

        if (!value) {
            return [];
        }

        return [value];

    }

});

var referenceListType = extend(listType, {
    type: referenceType
});
