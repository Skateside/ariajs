ARIA.Property = ARIA.createClass({

    init: function (element, attribute, tokens) {

        this.element = element;
        this.attribute = attribute;
        this.tokens = (
            Array.isArray(tokens)
            ? tokens
            : []
        );

        if (ARIA.hasAttribute(element, attribute)) {
            this.set(ARIA.getAttribute(element, attribute));
        }

    },

    setTokens: function (tokens) {
        this.tokens = tokens;
    },

    interpret: function (value) {
        return ARIA.Property.interpret(value);
    },

    isValidToken: function (value) {
        return !this.tokens.length || this.tokens.indexOf(value) > -1;
    },

    get: function () {

        var element = this.element;
        var attribute = this.attribute;

        return (
            ARIA.hasAttribute(element, attribute)
            ? this.interpret(ARIA.getAttribute(element, attribute))
            : null
        );

    },

    set: function (value) {

        var element = this.element;
        var attribute = this.attribute;
        var interpretted = this.interpret(value);

        if (interpretted !== "" && this.isValidToken(interpretted)) {
            ARIA.setAttribute(element, attribute, interpretted);
        } else if (interpretted === "") {
            ARIA.removeAttribute(element, attribtue);
        }

    }

});

ARIA.Property.interpret = function (value) {

    return (
        (value === null || value === undefined)
        ? ""
        : String(value)
    );

};
