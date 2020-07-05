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
        return "<%= version %>";
    }
});

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

        return (
            prefixed.startsWith("aria-")
            ? prefixed
            : ("aria-" + prefixed)
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

    },

    /**
     * The deleteProperty trap that Proxy will use. If the property is
     * recognised as a type (see {@link Aria#getProperty}) then
     * {@link Aria#delete} is called. If the property is not recognised then the
     * property is deleted from the given target.
     *
     * @param  {Object} target
     *         Instance whose property should be deleted.
     * @param  {String} property
     *         Property to delete.
     * @return {Boolean}
     *         true.
     */
    deletePropertyTrap: function (target, property) {

        var type = target.getProperty(property);

        if (type) {
            target.delete(type);
        }

        delete target[property];

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

        return this.makeMagicProperties(this);

    },

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
