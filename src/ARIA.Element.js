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

        this.preloadAttributes();
        this.readAttributes();
        this.observeAttributes();

    },

    /**
     * Creates placeholders for all the WAI-ARIA attributes that are in
     * {@link ARIA.factories}. The factories are lazy-loaded so they're only
     * instantiated as needed.
     */
    preloadAttributes: function () {

        Object.keys(ARIA.factories).forEach(function (attribute) {

            var instance;
            var element = this.element;

            function createValue() {

                instance = ARIA.runFactory(
                    attribute,
                    element,
                    ARIA.normalise(attribute)
                );

                instances.get(element)[attribute] = instance;

                return instance;

            }

            Object.defineProperty(this, attribute, {

                get: function () {
                    return (instance || createValue()).get();
                },

                set: function (value) {
                    return (instance || createValue()).set(value);
                }

            });

        }, this);


    },

    /**
     * Reads all teh WAI-ARIA attributes on {@link ARIA.Element#element} and
     * sets the {@link ARIA.Property} values.
     */
    readAttributes: function () {

        var hasOwnProperty = Object.prototype.hasOwnProperty;

        arrayFrom(this.element.attributes, function (attribute) {

            var name = attribute.name.replace(/^aria\-/, "");

            if (hasOwnProperty.call(this, name)) {
                this[name].set(attribute.value);
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
    }

});
