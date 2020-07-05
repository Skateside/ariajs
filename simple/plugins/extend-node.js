(function (Aria) {

    "use strict";

    if (!Aria || !Aria.VERSION) {
        return;
    }

    var PROPERTY = "aria";

    // https://github.com/LeaVerou/bliss/issues/49

    Object.defineProperty(Node.prototype, PROPERTY, {

        configurable: true,

        get: function getter() {

            let node = this;

            Object.defineProperty(Node.prototype, PROPERTY, {
                get: undefined
            });

            Object.defineProperty(node, PROPERTY, {
                value: new Aria(node)
            })

            Object.defineProperty(Node.prototype, PROPERTY, {
                get: getter
            });

            return node.aria;

        }

    });

    Object.defineProperty(Node.prototype, "role", {

        configurable: true,

        get: function () {
            return this.aria.role;
        },

        set: function (value) {
            this.aria.role = value;
        }

    });

}(window.Aria));
