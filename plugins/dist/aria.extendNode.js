/**
 * @file    Adds the "aria" and "role" properties to Node.prototype if ARIA is
 *          set up to allow it.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    var nodeProto = Node.prototype;
    var ariaProp;
    var roleProp;

    function getString(source, property) {

        return (
            typeof source[property] === "string"
            ? source[property].trim()
            : ""
        );

    }

    if (ARIA && ARIA.extendDOM) {

        ariaProp = getString(ARIA.extendDOM, "aria");
        roleProp = getString(ARIA.extendDOM, "role");

        if (ariaProp && roleProp && ariaProp === roleProp) {

            throw new Error(
                "ARIA.extendDOM.aria and ARIA.extendDOM.role cannot be the same"
            );

        }

        if (ariaProp) {

            // https://github.com/LeaVerou/bliss/issues/49
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

            if (roleProp) {

                Object.defineProperty(nodeProto, roleProp, {

                    configurable: true,

                    get: function () {
                        return this[ariaProp].role;
                    },

                    set: function (value) {

                        this[ariaProp].role = value;

                        return true;

                    }

                });

            }

        }

    }

}(window.ARIA));

//# sourceMappingURL=aria.extendNode.js.map
