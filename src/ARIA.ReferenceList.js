ARIA.ReferenceList = ARIA.createClass(ARIA.List, {

    interpret: function (value) {

        var interpretted = [];

        if (typeof value === "object" && typeof value.length === "number") {
            interpretted = arrayFrom(value, this.$super, this);
        } else if (typeof value === "string" || ARIA.isNode(value)) {
            interpretted = [this.$super(value)];
        }

        // Remove all falsy values such as "" or null.
        return interpretted.filter(Boolean);

    },

    get: function () {
        return this.toArray(ARIA.getById);
    },

    contains: function (item) {
        return this.$super(this.interpret(item)[0] || "");
    },

    has: function (item) {

        return this.hasAttribute() && (
            item === undefined
            ? this.get().filter(Boolean).length === this.length
            : this.contains(item)
        );

    }

});
