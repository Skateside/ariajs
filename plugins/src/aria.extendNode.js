/**
 * @file    Adds the "aria" and "role" properties to Node.prototype if ARIA is
 *          set up to allow it.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    var ariaProperty = "";
    var ariaIsString = true;
    var roleProperty = "";
    var roleIsString = true;
    var roleInstances = new WeakMap();

    /**
     * Gets the instance of {@link ARIA.List} for the given element that handles
     * the element's role attribute. If there is no instance, once is created
     * before being returned.
     *
     * @private
     * @param   {Element} element
     *          Element whose role {@link ARIA.List} should be returned.
     * @return  {ARIA.List}
     *          ARIA.List instance.
     */
    function getRoleInstance(element) {

        var list = roleInstances.get(element);

        if (!list) {

            list = new ARIA.List(element, "role", ARIA.tokens.role);
            roleInstances.set(element, list);

        }

        return list;

    }

    /**
     * Gets the value of the {@link ARIA.List} instance for the given element.
     *
     * @private
     * @see     getRoleInstance
     * @param   {Element} element
     *          Element whose instance value should be returned.
     * @return  {Array.<String>}
     *          Value of the {@link ARIA.List} instance.
     */
    function roleGetter(element) {
        return getRoleInstance(element).get();
    }

    /**
     * Adds a lazy-loaded instance to Node.prototype.
     *
     * @private
     * @see     https://github.com/LeaVerou/bliss/issues/49
     * @param   {String} name
     *          Name of the property to add.
     * @param   {Function} valueMaker
     *          Function which creates the value. This function is passed the
     *          Node instance as a parameter.
     * @param   {Function} [valueGetter]
     *          Optional function for retrieving the value from the object. The
     *          function is passed the Node instance as a parameter. If
     *          ommitted, the value is retrieved by getting the property of the
     *          Node instance at the given name.
     * @param   {Object} [settings]
     *          Optional additional settings for the property descriptor.
     */
    function addNodeProperty(name, valueMaker, valueGetter, settings) {

        var descriptor = {

            configurable: true,

            get: function getter() {

                var object = this;

                Object.defineProperty(Node.prototype, name, {
                    get: undefined
                });

                Object.defineProperty(object, name, {
                    value: valueMaker(object)
                });

                Object.defineProperty(Node.prototype, name, {
                    get: getter
                });

                return (
                    typeof valueGetter === "function"
                    ? valueGetter(object)
                    : object[name]
                );

            }

        };

        if (settings) {

            Object.keys(settings).forEach(function (key) {
                descriptor[key] = settings[key];
            });

        }

        Object.defineProperty(Node.prototype, name, descriptor);

    }

    if (ARIA && ARIA.extendDOM) {

        ariaProperty = ARIA.extendDOM.aria;
        roleProperty = ARIA.extendDOM.role;
        ariaIsString = typeof ariaProperty === "string";
        roleIsString = typeof roleProperty === "string";

        if (
            ariaIsString
            && roleIsString
            && ariaProperty.trim() === roleProperty.trim()
        ) {

            throw new Error(
                "aria.js: ARIA.extendDOM.aria cannot be the same as " +
                "ARIA.extendDOM.role"
            );

        }

        if (ariaIsString) {

            /**
             * The property that handles the WAI-ARIA attributes on the element.
             * The name of this property can be changed by adjusting
             * {@link ARIA.extendDOM.aria}.
             *
             * @name     aria
             * @memberof Element
             * @instance
             * @type     {ARIA.Element}
             */
            addNodeProperty(ariaProperty.trim(), function (context) {
                return new ARIA.Element(context);
            });

        }

        if (roleIsString) {

            /**
             * The property that handles the role attribute on the element. The
             * name of this property can be changed by adjusting
             * {@link ARIA.extendDOM.role}.
             *
             * @name     role
             * @memberof Element
             * @instance
             * @type     {ARIA.List}
             */
             addNodeProperty(roleProperty.trim(), roleGetter, roleGetter, {

                 set: function (value) {
                     getRoleInstance(this).set(value);
                 }

             });

        }

    }

}(window.ARIA));
