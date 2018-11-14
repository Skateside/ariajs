/**
 * @file    Adds the "aria" and "role" properties to Node.prototype.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    var nodeProto = Node.prototype;
    var ariaProp = "aria";
    var roleProp = "role";

    if (ARIA && ARIA.VERSION) {

        // https://github.com/LeaVerou/bliss/issues/49

        /**
         * An instance of {@link ARIA.Element} for the node to handle all
         * WAI-ARIA attributes. Lazy-loaded to save on processing power.
         *
         * @memberof Node
         * @instance
         * @name     aria
         * @type     {ARIA.Element}
         */
        Object.defineProperty(nodeProto, ariaProp, {

            configurable: true,

            get: function getter() {

                var object = this;

                Object.defineProperty(nodeProto, ariaProp, {
                    get: undefined
                });

                Object.defineProperty(object, ariaProp, {
                    value: new ARIA.Element(object)
                });

                Object.defineProperty(nodeProto, ariaProp, {
                    get: getter
                });

                return object[ariaProp];

            }

        });

        /**
         * An instance of {@link ARIA.List} for the node to handle the role
         * attribute.
         *
         * @memberof Node
         * @instance
         * @name     aria
         * @type     {ARIA.List}
         */
        Object.defineProperty(nodeProto, roleProp, {

            configurable: true,

            get: function () {
                return this[ariaProp].role;
            },

            set: function (value) {
                this[ariaProp].role = value;
            }

        });

    }

}(window.ARIA));
