/**
 * Creates the WAI-ARIA properties for the given element.
 *
 * @constructor
 * @param       {Element} element
 *              Element whose WAI-ARIA attributes should be handled.
 */
function Aria(element) {

    /**
     * Element that this instance is affecting.
     * @type {Element}
     */
    this.element = element;

    return this.makeMagicProperties(this);

}

/**
 * The current version of this library, in semver.
 * @memberof Aria
 * @name VERSION
 * @type {String}
 */
Object.defineProperty(Aria, "VERSION", {
    get: function () {
        return "<%= version %>";
    }
});

assign(Aria, /** @lends Aria */{

    /**
     * Information for each of the properties that the instance will use.
     * @type {Object}
     */
    types: {},

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

        return (
            prefixed.startsWith("aria-")
            ? prefixed
            : ("aria-" + prefixed)
        );

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
    addType: function (property, type, attribute) {

        if (attribute === undefined) {
            attribute = this.prefix(property);
        }

        this.types[property] = extend(type, {
            name: attribute
        });

    },

    /**
     * The get trap that Proxy will use. If the property is recognised as a type
     * (see {@link Aria#getType}) then it's passed to {@link Aria#read}. If the
     * property isn't recognised, the target's property is returned (which may
     * be undefined).
     *
     * @param  {Object} target
     *         Instance whose property should be accessed.
     * @param  {String} property
     *         Name of the property to access.
     * @return {?}
     *         Target's property or the result of reading property type.
     */
    getTrap: function (target, property) {

        var type = target.getType(property);

        if (type) {
            return target.read(type);
        }

        return target[property];

    },

    /**
     * The set trap that Proxy will use. If the property is recognised as a type
     * (see {@link Aria#getType}) then the value is passed to
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

        var type = target.getType(property);

        if (type) {
            target.write(type, value);
        } else {
            target[property] = value;
        }

        return true;

    },

    /**
     * The deleteProperty trap that Proxy will use. If the property is
     * recognised as a type (see {@link Aria#getType}) then {@link Aria#delete}
     * is called. If the property is not recognised then the property is deleted
     * from the given target.
     *
     * @param  {Object} target
     *         Instance whose property should be deleted.
     * @param  {String} property
     *         Property to delete.
     * @return {Boolean}
     *         true.
     */
    deletePropertyTrap: function (target, property) {

        var type = target.getType(property);

        if (type) {
            target.delete(type);
        }

        delete target[property];

        return true;

    }

});

Aria.prototype = {

    /**
     * Creates the magic properties for this instance.
     *
     * @param  {Aria} context
     *         Instance that will gain the magic properties.
     * @return {Proxy}
     *         Version of the instance with magic properties.
     */
    makeMagicProperties: function (context) {

        return new Proxy(context, {

            get: function (target, property) {
                return Aria.getTrap(target, property);
            },

            set: function (target, property, value) {
                return Aria.setTrap(target, property, value);
            },

            deleteProperty: function (target, property) {
                return Aria.deletePropertyTrap(target, property);
            }

        });

    },

    /**
     * Gets the property from {@link Aria.types}.
     *
     * @param  {String} property
     *         Property to access.
     * @return {Object|undefined}
     *         Property type or undefined if the type doesn't exist.
     */
    getType: function (property) {
        return Aria.types[property];
    },

    /**
     * Passes the attribute's value to the given type's read method. The value
     * will be null if the attribute isn't set on {@link Aria#element}.
     *
     * @param  {Object} type
     *         Property type that will read the attribute's value and define the
     *         attribute's name.
     * @return {?}
     *         Result of reading the property.
     */
    read: function (type) {
        return type.read(this.element.getAttribute(type.name));
    },

    /**
     * Writes the attribute's value after passing it to the given type's write
     * method. If the result from the type's write method is an empty string,
     * the type is passed to {@link Aria#delete}; if not, the attribute is set
     * on {@link Aria#element}.
     *
     * @param {Object} type
     *        Property type that will write the attribute's value and define the
     *        attribute's name.
     * @param {?} value
     *        Value to write.
     */
    write: function (type, value) {

        var writable = type.write(value);

        if (writable !== "") {
            this.element.setAttribute(type.name, writable);
        } else {
            this.delete(type);
        }

    },

    /**
     * Removes the type's attribute from {@link Aria#element}.
     *
     * @param {Object} type
     *        Type that will define the attribute name to remove.
     */
    delete: function (type) {
        this.element.removeAttribute(type.name);
    }

}

// Expose the Aria constructor.
globalVariable.Aria = Aria;
