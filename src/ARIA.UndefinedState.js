ARIA.UndefinedState = ARIA.createClass(ARIA.State, {

    isValidToken: function (value) {

        return (
            value === undefined
            || value === "undefined"
            || this.$super(value)
        );

    },

    interpret: function (value) {

        return (
            (value === undefined || value === "undefined")
            ? "undefined"
            : this.$super(value)
        );

    }

});
