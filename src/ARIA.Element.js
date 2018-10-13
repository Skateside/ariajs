/**
 * Handles the WAI-ARIA attributes on an element.
 *
 * @class ARIA.Element
 */
ARIA.Element = ARIA.createClass({

    init: function (element) {

        this.element = element;
        this.manipulationFlags = Object.create(null);
        this.preloadAttributes();
        this.readAttributes();
        this.observeAttributes();

    },

    preloadAttributes: function () {

        Object.keys(ARIA.factories).forEach(function (attribute) {

            var value;

            Object.defineProperty(this, attribute, {

                get: function () {

                    if (!value) {

                        value = ARIA.runFactory(
                            attribute,
                            this.element,
                            ARIA.normalise(attribute)
                        );

                    }

                    return value;

                },

                set: function (value) {
                    this[attribute].set(value);
                }

            });

        }, this);


    },

    readAttributes: function () {

        var hasOwnProperty = Object.prototype.hasOwnProperty;

        arrayFrom(this.element.attributes, function (attribute) {

            var name = attribute.name.replace(/^aria\-/, "");

            if (hasOwnProperty.call(this, name)) {
                this[name] = attribute.value;
            }

        }, this);

    },

    observeAttributes: function () {

        var that = this;
        var element = that.element;
        var observer = new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {

                var attribute = mutation.attributeName || "";
                var suffix = attribute.slice(5);
                var value;
                var old;
console.log("mutation.type = %o, suffix = %o, factories = %o, flag = %o, getAttribute = %o, element = %o", mutation.type, suffix, ARIA.factories[suffix] ? "found": "NOT FOUND", that.manipulationFlags[suffix], element.getAttribute(attribute), element);
                if (
                    mutation.type === "attributes"
                    && ARIA.factories[suffix]
                    && !that.manipulationFlags[suffix]
                ) {

                    that.manipulationFlags[suffix] = true;

                    if (element.hasAttribute(attribute)) {

                        value = ARIA.Property.interpret(
                            element.getAttribute(attribute)
                        );
                        old = ARIA.Property.interpret(mutation.oldValue);

console.log("attribute %o (%o) on %o changed from %o to %o", attribute, suffix, element, old, value);
                        if (value !== old) {
                            that[suffix].set(value);
                        }

                    } else {
                        that[suffix].remove();
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

        that.observer = observer;

    },

    disconnectAttributes: function () {
        this.observer.disconnect();
    }

});
