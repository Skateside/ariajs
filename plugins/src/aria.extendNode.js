/**
 * @file    Adds the "aria" and "role" properties to Node.prototype if ARIA is
 *          set up to allow it.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    var extendDOM = "";

    if (ARIA && typeof ARIA.extendDOM === "string") {

        extendDOM = ARIA.extendDOM.trim();

        Object.defineProperty(Node.prototype, extendDOM, {

            configurable: true,

            get: function getter() {

                var object = this;

                Object.defineProperty(Node.prototype, extendDOM, {
                    get: undefined
                });

                Object.defineProperty(object, extendDOM, {
                    value: new ARIA.Element(object)
                });

                Object.defineProperty(Node.prototype, extendDOM, {
                    get: getter
                });

                return object[extendDOM];

            }

        });

    }

}(window.ARIA));
