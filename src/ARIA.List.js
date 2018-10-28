ARIA.List = ARIA.createClass(ARIA.Property, {

    init: function (element, attribute) {

        this.$super(element, attribute);
        this.list = [];

    },

    interpret: function (value) {

        var val = (
            Array.isArray(value)
            ? value.join(" ")
            : value
        );
        var string = this.$super(val);

        return (
            string.length
            ? string.split(/\s+/)
            : []
        );

    },

    set: function (value) {

        var values = this.interpret(value).filter(this.isValidToken, this);
        var element = this.element;
        var attribute = this.attribute;

        this.list = values;

        if (values.length) {
            ARIA.setAttribute(element, attribute, values.join(" "));
        } else {
            ARIA.removeAttribute(element, attribute);
        }

    },

    get: function () {
        return this.list.concat();
    }

});
