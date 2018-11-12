/**
 * @file    Adds the "aria" and "role" properties to Node.prototype if ARIA is
 *          set up to allow it.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    var nodeProto = Node.prototype;
    var extendDOM = "";

    if (ARIA && typeof ARIA.extendDOM === "string") {

        extendDOM = ARIA.extendDOM.trim();

        // https://github.com/LeaVerou/bliss/issues/49
        Object.defineProperty(nodeProto, extendDOM, {

            configurable: true,

            get: function getter() {

                var object = this;

                Object.defineProperty(nodeProto, extendDOM, {
                    get: undefined
                });

                Object.defineProperty(object, extendDOM, {
                    value: new ARIA.Element(object)
                });

                Object.defineProperty(nodeProto, extendDOM, {
                    get: getter
                });

                return object[extendDOM];

            }

        });

    }

}(window.ARIA));
