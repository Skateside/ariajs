ARIA.Integer = ARIA.createClass(ARIA.Number, {

    interpret: function (value) {
        return Math.floor(this.$super(value));
    }

});
