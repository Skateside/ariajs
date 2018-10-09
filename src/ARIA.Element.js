ARIA.Element = ARIA.createClass({

    init: function (element) {

        this.element = element;
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

        var element = this.element;
        var observer = new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {

                var attribute = mutation.attributeName;
                var suffix = (attribute || "").slice(5);

                if (
                    mutation.type === "attributes"
                    && ARIA.factories[suffix]
                ) {
                    this[suffix] = element.getAttribute(attribute);
                }

            });

        });

        observer.observe(element, {
            attributes: true
        });

        this.observer = observer;

    },

    disconnectAttributes: function () {
        this.observer.disconnect();
    }

});
