ARIA.UndefinedState = ARIA.createClass(ARIA.State, {

    init: function (element, attribute) {

        this.$super(element, attribute);
        this.tokens.push(undefined, "undefined");

    },

    interpret: function (value) {

        return (
            (value === undefined || value === "undefined")
            ? "undefined"
            : this.$super(value)
        );

    }

});
