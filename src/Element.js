(function (ARIA) {

    "use strict";

    var ariaProperty = "";
    var ariaIsString = true;
    var roleProperty = "";
    var roleIsString = true;
    var roleInstances = new WeakMap();

    function getRoleInstance(element) {

        var list = roleInstances.get(element);

        if (!list) {

            list = new ARIA.List(element, "role", ARIA.tokens.role);
            roleInstances.set(element, list);

        }

        return list;

    }

    function roleGetter(element) {
        return getRoleInstance(element).get();
    }

    // https://github.com/LeaVerou/bliss/issues/49
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
