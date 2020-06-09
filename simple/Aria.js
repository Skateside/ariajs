function Aria(element) {

    this.element = element;

    return this.makeMagicProperties(this);

}

Object.defineProperty(Aria, "VERSION", {
    get: function () {
        return "<%= version %>";
    }
});

assign(Aria, {

    types: {},

    prefix: function (property) {

        var prefixed = interpretString(property).toLowerCase();

        return (
            prefixed.startsWith("aria-")
            ? prefixed
            : ("aria-" + prefixed)
        );

    },

    addType: function (property, type, attribute) {

        if (attribute === undefined) {
            attribute = this.prefix(property);
        }

        this.types[property] = extend(type, {
            name: attribute
        });

    },

    getTrap: function (target, property) {

        var type = target.getType(property);

        if (type) {
            return target.read(type);
        }

        return target[property];

    },

    setTrap: function (target, property, value) {

        var type = target.getType(property);

        if (type) {
            target.write(value, type);
        } else {
            target[property] = value;
        }

        return true;

    },

    deletePropertyTrap: function (target, property) {

        var type = target.getType(property);

        if (type) {
            target.delete(type);
        }

        delete target[property];

        return true;

    }

});

Aria.prototype = {

    makeMagicProperties: function (context) {

        return new Proxy(context, {

            get: function (target, property) {
                return Aria.getTrap(target, property);
            },

            set: function (target, property, value) {
                return Aria.setTrap(target, property, value);
            },

            deleteProperty: function (target, property) {
                return Aria.deletePropertyTrap(target, property);
            }

        });

    },

    getType: function (property) {
        return Aria.types[property];
    },

    read: function (type) {
        return type.read(this.element.getAttribute(type.name));
    },

    write: function (value, type) {

        var writable = type.write(value);

        if (writable !== "") {
            this.element.setAttribute(type.name, writable);
        } else {
            this.delete(type);
        }

    },

    delete: function (type) {
        this.element.removeAttribute(type.name);
    }

}

globalVariable.Aria = Aria;
