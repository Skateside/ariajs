ARIA.State = ARIA.createClass(ARIA.Property, {

    init: function (element, attribute) {

        this.$super(element, attribute);
        // TODO: do I need to include `true` and `"true"` etc.?
        this.setTokens([
            true,
            "true",
            false,
            "false"
        ]);

    },

    interpret: function (value) {

        var interpretted = this.$super(value);

        return (
            interpretted === ""
            ? ""
            : interpretted === "true"
        );

    }

});
