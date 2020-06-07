/**
 * The base type from which all types come.
 * @type {Object}
 */
export let basicType = {

    /**
     * Coerces the given value to make sure it's a string. null and undefined
     * are converted into an empty string.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {String}
     *         String based on the given value.
     */
    coerce(value) {

        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "string") {
            return value;
        }

        return String(value);

    },

    /**
     * Reads the value from the element's attribute and coerces it as necessary.
     *
     * @param  {String|null} value
     *         The element's attribute value.
     * @return {String}
     *         The coerced value.
     */
    read(value) {
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
    write(value) {
        return this.coerce(value);
    }

};

export let floatType = {

    ...basicType,

    read(value) {
        return Number(basicType.read(value));
    }

};

export let integerType = {

    ...floatType,

    read(value) {
        return Math.floor(floatType.read(value));
    }

};

export let stateType = {

    ...basicType,

    coerce(value) {

        let coerced = basicType.coerce(value);

        if (coerced === "") {
            return false;
        }

        return (/^true$/i).test(coerced);

    },

    read(value) {
        return this.coerce(value);
    },

    write(value) {

        if (value === "") {
            return value;
        }

        return (
            value
            ? "true"
            : "false"
        );

    }

};

export let tristateType = {

    ...stateType,

    read(value) {

        let coerced = this.coerce(value);

        return (
            coerced === "mixed"
            ? coerced
            : stateType.read(value)
        );

    },

    write(value) {

        return (
            value === "mixed"
            ? value
            : stateType.write(value)
        );

    }

};

export let undefinedStateType = {

    ...stateType,

    coerce(value) {

        return (
            (value === "" || (/^undefined$/i).test(value))
            ? undefined
            : stateType.coerce(value)
        );

    },

    read(value) {
        return this.coerce(value);
    }

};

export let referenceType = {

    ...basicType,

    read(value) {
        return document.getElementById(basicType.read(value));
    },

    write(value) {

        if (this.isElement(value)) {
            value = this.identify(value);
        }

        return basicType.write(value);

    },

    isElement(object) {
        return (object instanceof Element);
    },

    counter: 0,

    identify(element) {

        let id = element.id;

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

};

export let listType = {

    ...basicType,

    type: basicType,

    read(value) {
        return value.trim().split(/\s+/).map((item) => this.type.read(item));
    },

    write(value) {

        if (typeof value === "string") {
            return value;
        }

        return this
            .asArray(value)
            .map((item) => this.type.write(item))
            .join(" ");

    },

    asArray(value) {

        if (
            value
            && typeof value.length === "number"
            && typeof value !== "string"
        ) {
            return [...value];
        }

        if (!value) {
            return [];
        }

        return [value];

    }

};

export let referenceListType = {

    ...listType,

    type: referenceType

};
