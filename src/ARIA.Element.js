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
        var element = that.element;
        var observer = new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {

                var attribute = mutation.attributeName || "";
                var suffix = attribute.slice(5);
                var value;
                var old;

                if (
                    mutation.type === "attributes"
                    && ARIA.factories[suffix]
                    && !that.manipulationFlags[suffix]
                ) {

                    that.manipulationFlags[suffix] = true;

                    if (ARIA.hasAttribute(element, attribute)) {

                        value = ARIA.Property.interpret(
                            ARIA.getAttribute(element, attribute)
                        );
                        old = ARIA.Property.interpret(mutation.oldValue);

                        if (value !== old) {
                            that[suffix] = value;
                        }

                    } else {
                        that[suffix] = "";
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
                var isDeleted = false;

                if (instance) {

                    instance.set("");
                    isDeleted = true;

                } else {
                    isDeleted = delete target[name];
                }

                return isDeleted;

            }

        });

    }

});

// Create a fall-back for browsers that don't understand Proxy.
// Object.defineProperty can be used for get and set, but delete will have to
// rely on polling.
if (!globalVariable.Proxy) {

    // Use requestAnimationFrame instead of setTimeout if possible. This has the
    // advantage of pausing execution when the window loses focus.
    var raf = (
        globalVariable.requestAnimationFrame
        || globalVariable.webkitRequestAnimationFrame
        || globalVariable.mozRequestAnimationFrame
        || function (callback) {
            globalVariable.setTimeout(callback, 1000 / 60);
        }
    );

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

                        raf(function poll() {

                            if (isPolling) {

                                if (owns(attribute)) {

                                    raf(poll);
                                    isPolling = true;

                                } else {

                                    isPolling = false;
                                    instance.set("");
                                    setProperty(attribute);

                                }

                            }

                        }, delay);
                        isPolling = true;

                    }

                    return instance.set(value);

                }

            });

        });

    };

}
