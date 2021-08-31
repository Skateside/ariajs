(function (Aria, Proxy) {

    "use strict";

    // Bail if we can't find Aria or we can't use Proxy.
    if (!Aria || !Aria.VERSION || !Proxy) {
        return;
    }

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
    Aria.deletePropertyTrap = function (target, property) {

        var type = target.getProperty(property);

        if (type) {
            target.delete(type);
        }

        delete target[property];

        return true;

    };

    /**
     * Creates the properties for this instance.
     *
     * @param  {Aria} context
     *         Instance that will gain the properties.
     * @return {Proxy}
     *         Version of the instance with properties.
     */
    Aria.prototype.makeProperties = function (context) {

        return new Proxy(context, {

            get: function (target, property) {
                return Aria.getTrap(target, Aria.unprefix(property));
            },

            set: function (target, property, value) {
                return Aria.setTrap(target, Aria.unprefix(property), value);
            },

            deleteProperty: function (target, property) {
                return Aria.deletePropertyTrap(target, Aria.unprefix(property));
            }

        });

    };

}(window.Aria, window.Proxy));
