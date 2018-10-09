ARIA.Tristate = ARIA.createClass(ARIA.State, {

    isValidToken: function (value) {
        return value === "mixed" || this.$super(value);
    },

    interpret: function (value) {

        return (
            value === "mixed"
            ? value
            : this.$super(value)
        );

    }

});
