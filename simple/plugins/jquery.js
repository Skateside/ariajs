(function (Aria, $) {

    "use strict";

    // Bail if we don't have Aria or jQuery on the page.
    if (!Aria || !Aria.VERSION || !$ || !$.fn) {
        return;
    }

    // Work out all the referenceType properties so we can check for and work
    // around a simple gotcha later on.
    var referenceProperties = [];
    var referenceListProperties = [];
    var types = Aria.types;
    var referenceType = types.reference;
    var referenceListType = types.referenceList;

    $.each(Aria.properties, function (property, data) {

        if (data.type === referenceType) {
            referenceProperties.push(property);
        } else if (data.type === referenceListType) {
            referenceListProperties.push(property);
        }

    });

    /**
     * Gets the Aria instance for the given element. If that instance hasn't
     * created yet, it's created before being returned.
     *
     * @private
     * @param   {Element} element
     *          Element whose Aria instance should be returned.
     * @return  {Aria}
     *          Aria instance for the given element.
     */
    function getAria(element) {

        var aria = $.data(element, "aria");

        if (!aria) {

            aria = new Aria(element);
            $.data(element, "aria", aria);

        }

        return aria;

    }

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

            aria = getAria(that[0]);
            result = aria[property];

            // If the result is supposed to be a reference or reference list,
            // wrap it in a jQuery object before returning it.
            if (
                $.inArray(property, referenceProperties) > -1
                || $.inArray(property, referenceListProperties) > -1
            ) {
                result = $(result);
            }

            return result;

        }

        return that.each(function (index, element) {

            // If the user passed a jQuery object value to a referenceType
            // property, get the first item because that's probably the
            // intention.
            if ($.inArray(property, referenceProperties) > -1 && value.length) {
                value = value[0];
            }

            // A function should resolve the way it would for jQuery's attr().
            if ($.isFunction(value)) {

                value = value.call(
                    element,
                    index,
                    element.getAttribute(Aria.properties[property].name)
                );

            }

            getAria(this)[property] = value;

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

}(window.Aria, window.jQuery));
