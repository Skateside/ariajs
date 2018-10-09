ARIA.isNode = function (value) {
    return (value instanceof Node);
};

ARIA.getRef = function (id) {
    return document.getElementById(id);
};

function interpretReference(value) {

    return (
        ARIA.isNode(value)
        ? ARIA.identify(value)
        : value
    );

}

ARIA.Reference = ARIA.createClass(ARIA.Property, {

    interpret: function (value) {
        return interpretReference(value);
    },

    get: function () {
        return ARIA.getRef(this.getAttribute());
    }

});
