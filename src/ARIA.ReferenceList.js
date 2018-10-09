ARIA.ReferenceList = ARIA.createClass(ARIA.List, {

    interpret: function (value) {

        if (typeof value === "string") {
            value = this.$super(value);
        } else if (ARIA.isNode(value)) {
            value = [ARIA.identify(value)];
        } else if (value.length) {
            value = arrayFrom(value, interpretReference);
        }

    },

    get: function () {
        return this.toArray(ARIA.getRef);
    }

});
