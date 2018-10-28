ARIA.Number = ARIA.createClass(ARIA.Property, {

    interpret: function (value) {
        return parseFloat(this.$super(value));
    },

    isValidToken: function (value) {
        return !isNaN(this.interpret(value));
    }

});
