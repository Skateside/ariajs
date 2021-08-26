(function (Aria, $) {

    "use strict";

    // Bail if we don't have Aria or jQuery on the page.
    if (!Aria || !Aria.VERSION || !$ || !$.fn) {
        return;
    }

    /**
     * Gets the Aria instance for the given element. If that instance hasn't
     * created yet, it's created before being returned.
     *
     * @memberof jQuery
     * @param    {Element} element
     *           Element whose Aria instance should be returned.
     * @return   {Aria}
     *           Aria instance for the given element.
     */
    $.aria = function (element) {

        var aria = $.data(element, "aria");

        if (!aria) {

            aria = new Aria(element);
            $.data(element, "aria", aria);

        }

        return aria;

    };

    /**
     * Aria hooks - get and set hooks for modifying the return or accepted
     * values. These are based on {@link jQuery.attrHooks}.
     * @memberof jQuery
     * @type     {Object}
     */
    $.ariaHooks = {};

    $.each({
        reference: [
            "activedescendant",
            "details",
            "errormessage",
        ],
        referenceList: [
            "controls",
            "describedby",
            "flowto",
            "labelledby",
            "owns"
        ]
    }, function (type, properties) {

        $.each(properties, function (ignore, property) {

            var hook = {

                get: function (element) {
                    return $($.aria(element)[property]);
                }

            };

            if (type === "reference") {

                hook.set = function (element, value) {

                    if (value && value.length && typeof value !== "string") {
                        value = value[0];
                    }

                    $.aria(element)[property] = value;

                };

            }

            $.ariaHooks[property] = hook;

        });

    });

    /**
     * Either sets the values of the property (if the property is passed) or
     * gets the value of the property for the first element in the instance.
     *
     * @memberof jQuery
     * @instance
     * @name     aria
     * @param    {String} property
     *           Property to either get or set.
     * @param    {?} [value]
     *           Optional value to set.
     * @return   {Array.<String>|Boolean|jQuery|Number|String|undefined}
     *           Either the property value (if getting the value) or the jQuery
     *           object of the elements that had their values set.
     */
    $.fn.aria = function (property, value) {

        var aria;
        var result;
        var that = this;

        // Check for arguments.length rather than undefined because undefined is
        // a valid value to pass.
        if (arguments.length === 1) {

            // Check to see if we've been passed an object for setting a lot of
            // WAI-ARIA attributes at the same time.
            if ($.isPlainObject(property)) {

                $.each(property, function (key, val) {
                    that.aria(key, val);
                });

                return that;

            }

            property = Aria.unprefix(property);
            var hook = $.ariaHooks[property];

            if (hook && hook.get) {
                result = hook.get(that[0]);
            } else {

                aria = $.aria(that[0]);
                result = aria[property];

            }

            return result;

        }

        property = Aria.unprefix(property);

        return that.each(function (index, element) {

            var attributeValue = element.getAttribute(
                Aria.properties[property].name
            )

            // A function should resolve the way it would for jQuery's attr().
            if ($.isFunction(value)) {
                value = value.call(element, index, attributeValue);
            }

            var hook = $.ariaHooks[property];

            if (hook && hook.set) {
                value = hook.set(element, value, attributeValue);
            } else {
                $.aria(element)[property] = value;
            }

        });

    };

    /**
     * Removes the WAI-ARIA attribute(s) from the collection.
     *
     * @param  {String} name
     *         A whitespace-separated list of WAI-ARIA attributes to remove.
     * @return {jQuery}
     *         A jQuery object of the elements that had their attributes
     *         removed.
     */
    $.fn.removeAria = function (name) {

        return this.each(function () {

            var aria = $.aria(this);
            var attrNames = name && name.match(/[^\x20\t\r\n\f]+/g);

            if (attrNames && this.nodeType === 1) {

                attrNames.forEach(function (attrName) {
                    aria[Aria.unprefix(attrName)] = "";
                });

            }

        });

    };

    /**
     * Either gets the role for the first element or sets the role for all
     * elements.
     *
     * @memberof jQuery
     * @instance
     * @name     role
     * @param    {Array.<String>|String} [value]
     *           Optional role(s) to set.
     * @return   {Array.<String>|jQuery}
     *           Either an array of the roles of the first element or the jQuery
     *           object representing the elements that had their roles set.
     */
    $.fn.role = function (value) {

        return (
            arguments.length === 0
            ? this.aria("role")
            : this.aria("role", value)
        );

    };

    /**
     * Removes one or more roles from the given collection of elements.
     *
     * @param  {String} [value]
     *         A space-separated list of roles to remove. If ommitted, all roles
     *         are removed.
     * @return {jQuery}
     *         A jQuery object of the elements that had their roles modified.
     */
    $.fn.removeRole = function (value) {

        var that = this;

        if (arguments.length === 0) {
            return that.aria("role", "");
        }

        var values = (value && value.match(/[^\x20\t\r\n\f]+/g)) || [];

        return this.each(function () {

            that.aria("role", that.aria("role").filter(function (role) {
                return values.indexOf(role) < 0;
            }));

        });

    };

    /**
     * Returns the ID of the first element in the chain, creating a unique one
     * if necessary.
     *
     * @return {String}
     *         ID of the element.
     */
    $.fn.identify = function () {

        var element = this[0];
        var nodeType = (
            element
            ? element.nodeType
            : -1
        );

        if (
            nodeType === -1 // No element found.
            || nodeType === 3 // Text node.
            || nodeType === 8 // Comment node.
            || nodeType === 2 // Attribute node.
        ) {
            return;
        }

        return Aria.identify(element);

    };

}(window.Aria, window.jQuery));
