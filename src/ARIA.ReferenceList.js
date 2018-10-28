ARIA.ReferenceList = ARIA.createClass(ARIA.List, {

    interpret: function (value) {

        var interpretted = [];

        if (
            value
            && typeof value === "object"
            && typeof value.length === "number"
        ) {
            interpretted = arrayFrom(value, ARIA.Reference.interpret, this);
        } else if (typeof value === "string") {
            interpretted = this.$super(value);
        } else {
            interpretted = [ARIA.Reference.interpret(value)];
        }

        // Remove all falsy values such as "" or null.
        return interpretted.filter(Boolean);

    },

    get: function () {
        return this.$super().map(ARIA.getById);
    }

});
