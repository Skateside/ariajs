/*
div.aria.role.add("thing");

div.aria.controls.add(document.querySelector("..."))
div.aria.controls.add(...document.querySelectorAll("..."))
div.aria.controls = document.querySelector("...");
div.aria.controls = document.querySelectorAll("...");

div.aria.controls.toString();
[...div.aria.controls];
 */

// Work In Progress
// trying to work through how the various classes will interact.

let reference = Symbol("reference");
let getInstance = Symbol("getInstance");
let instances = Symbol("instances");

class Aria {

    constructor(element) {

        this[reference] = new Reference(element);
        this[instances] = Object.create(null);

        return new Proxy(this, {

            get(target, name) {

                if (Object.prototype.hasOwnProperty.call(target, name)) {
                    return target[name];
                }

                if (AttributeFactory.has(name)) {

                    target[name] = this[getInstance](name);
                    return target[name];

// NOTE:
// Returning a ListType and using one of its manipulator methods won't actually
// modify the DOM element's attribute value.

                }

                return undefined;

            },

            set(target, name, value) {

                if (AttributeFactory.has(name)) {

                    let instance = this[getInstance](name);

                    instance.write(value);

// NOTE:
// This doesn't actually update the DOM element's attribute value.

                    return true;

                }

                return false;

            }

        });

    }

    [getInstance](name) {

        if (!this[instances][name]) {
            this[instances][name] = AttributeFactory.create(name, this[reference]);
        }

        return this[instances][name];

    }

}

// Aria.defineFactory(new AttributeFactory()); // ?

// div.aria = new Aria(div);
let aria = new Aria(div);
aria.label; // ->


class AttributeFactory {

    constructor() {

        this.factories = Object.create(null);

    }

    register(name, Value, Attr = AriaAttribute, override = false) {

        if (this.factories[name] && !override) {
            throw new Error();
        }

        this.factories[name] = {
            attribute() {
                return new Attr(name);
            },
            value(raw) {
                return Value.create(raw);
            }
        };

    }

    create(name, reference) {

        let factory = this.factories[name];

        if (!factory) {
            throw new ReferenceError();
        }

        let attribute = factory.attribute();
        attribute.refer(reference);
        let value = factory.value(attribute.read());

        return value;

    }

}

let factory = new AttributeFactory();
factory.register("label", BasicType);
factory.register("role", ListType, Attribute);
factory.register("controls", ReferenceListType);
