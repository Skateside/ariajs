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
        // this.manipulationFlags = Object.create(null);

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

                return value;

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
            var suffix = ARIA.getSuffix(attribute);
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

                        requestAnimationFrame(function poll() {

                            if (isPolling) {

                                if (owns(attribute)) {

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
