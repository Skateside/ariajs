ARIA.Reference = ARIA.createClass(ARIA.Property, {

    interpret: function (value) {
        return ARIA.Reference.interpret(value);
    },

    get: function () {
        return ARIA.getById(this.$super());
    }

});

ARIA.Reference.interpret = function (value) {

    return (
        ARIA.isNode(value)
        ? ARIA.identify(value)
        : ARIA.Property.interpret(value)
    );

};
