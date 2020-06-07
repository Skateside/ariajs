export default class Aria {

    static types = {};

    static prefix(property) {

        let prefixed = (
            (property === null || property === undefined)
            ? ""
            : String(property)
        ).toLowerCase();

        return (
            prefixed.startsWith("aria-")
            ? prefixed
            : ("aria-" + prefixed)
        );

    }

    static addType(property, type, attribute = null) {

        if (attribute === null) {
            attribute = this.prefix(property);
        }

        this.types[property] = {
            ...type,
            name: attribute
        };

    }

    constructor(element) {

        this.element = element;

        return this.makeMagicProperties(this);

    }

    makeMagicProperties(context) {

        return new Proxy(context, {

            get(target, property) {

                let type = context.getType(property);

                if (type) {
                    return target.read(type);
                }

                return target[property];

            },

            set(target, property, value) {

                let type = context.getType(property);

                if (type) {
                    target.write(value, type);
                } else {
                    target[property] = value;
                }

                return true;

            },

            delete(target, property) {

                let type = context.getType(property);

                if (type) {
                    target.delete(type);
                }

                delete target[property];

                return true;

            }

        });

    }

    getType(property) {
        return this.constructor.types[property];
    }

    read(type) {
        return type.read(this.element.getAttribute(type.name));
    }

    write(value, type) {

        let writable = type.write(value);

        if (writable) {
            this.element.setAttribute(type.name, writable);
        } else {
            this.delete(type);
        }

    }

    delete(type) {
        this.element.removeAttribute(type.name);
    }

}
