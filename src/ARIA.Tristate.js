ARIA.Tristate = ARIA.createClass(ARIA.State, {

    init: function (element, attribute) {

        this.$super(element, attribute);
        this.tokens.push("mixed");

    },

    interpret: function (value) {

        return (
            value === "mixed"
            ? value
            : this.$super(value)
        );

    }

});
