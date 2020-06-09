(function (Aria) {

    "use strict";

    if (!Aria || !Aria.VERSION) {
        return;
    }

    Aria.prototype.makeMagicProperties = function () {

        var that = this;

        Object.entries(Aria.types).forEach(function (entry) {

            var property = entry[0];
            var data = entry[1];

            Object.defineProperty(that, property, {

                get: function () {
                    return Aria.getTrap(that, property);
                },

                set: function (value) {
                    return Aria.setTrap(that, property, value);
                }

            });

        },);

    };

}(window.Aria));
