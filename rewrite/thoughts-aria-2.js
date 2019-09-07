// More thoughts about how this could work.

/*

var div = document.querySelector("...");
div.aria = new Aria(div);
div.aria.controls = document.querySelector("...");

 */

class Aria {

    constructor(element) {

        this.element = element;
        this.instances = Object.create(null);
        this.startObserving();

        return new Proxy(this, {

            get(target, name) {

                let property = this.accessProperty(target, name);

                if (property instanceof Mediator) {
                    return property.read();
                }

                return property;

            },

            set(target, name, value) {

                let property = this.accessProperty(target, name);

                if (property instanceof Mediator) {
                    return property.write(value);
                }

                target[name] = value;

                return true;

            },

            deleteProperty(target, name) {

                let property = this.accessProperty(target, name);

                if (property instanceof Mediator) {
                    return property.clear();
                }

                delete target[name];
                return true;

            }

        });

    }

    accessProperty(object, property) {

        if (Object.prototype.hasOwnProperty.call(object, property)) {
            return object[property];
        }

        let instance = this.getInstance(property);

        if (instance) {

            object[property] = instance;
            return instance;

        }

        return undefined;

    }

    getInstance(property) {

        let instance = this.instances[property];

        if (!instance) {

            instance = Factory.get().create(property, this.element);
            this.instances[property] = instance;

        }

        return instance;

    }

    startObserving() {

        let observer = new MutationObserver((mutations) => {

            mutations.forEach(({ type, attributeName = "" }) => {

                let attribute = AriaAttribute.unprefix(attributeName);

                if (type === "attributes") {

                    let instance = this.getInstance(attribute);

                    if (instance instanceof Mediator) {
                        instance.updateFromAttribute();
                    }

                }

            });

        });

        observer.observe(this.element, {
            attributes: true
        });

        return observer;

// this.observer = new MutationObserver(...);
    }

}


/*

// let factory = Factory.get();
//
// factory.addFactory("label", BasicType);
// factory.addFactory("controls", ReferenceListType);
// factory.addFactory("roles", ListType, AriaAttribute);
//
// let role = factory.create("role")(this.element); // passes the current value to the type

 */

class Attribute {
    constructor(name) {
        this.name = name;
        if ((/\s/).test(name)) {
            throw new Error("... invalid attribute name ...");
        }
    }
    write(element, value) {}
    read(element) {}
    exists(element) {}
    clear(element) {}
    isEmpty(element) {

        if (!element) {
            return true;
        }

        return this.exists(element) && this.read(element) !== "";

    }
    static cache = Object.create(null);
    static create(name) {

        name = String(name).toLowerCase();

        if (!this.cache[name]) {
            this.cache[name] = new this(name);
        }

        return this.cache[name];

    }
}
class AriaAttribute extends Attribute {
    static prefix(name) {
        if (!name.startsWith("aria-")) {
            name = "aria-" + name;
        }
        return name;
    }
    static unprefix(name) {
        if (name.startsWith("aria-")) {
            name = name.slice("aria-".length);
        }
        return name;
    }
    static create(name) {
        return super.create(this.prefix(name));
    }
    constructor(name) {
        super(name);
        if (!name.startsWith("aria-")) {
            throw new Error("...");
        }
        // ...
    }
}

class Reference {

    identify() {

        let reference = this.reference;

        if (!reference) {
            return;
        }

        let id = this.id;

        if (!id) {

            // id = new Attribute("id");
            id = Attribute.create("id");
            this.id = id;

        }

        if (!id.exists(reference)) {
            id.write(reference, this.generateId());
        }

        return id.read(reference);

    }

}

class Observer {
    constructor(element = document.createElement("div")) {
        this.element = element;
    }
    addEventListener(eventName, handler) {}
    removeEventListener(eventName, handler) {}
    createEvent(eventName, detail) {}
    dispatchEvent(event, detail) {}
}

class BasicType extends Observer {
    static get EMPTY_VALUE() { return ""; }
    static get EVENT_UPDATED() { return "updated"; }
    constructor(value = BasicType.EMPTY_VALUE) {
        super();
        this.value = value;
    }
    write(value) {
        this.value = value;
        this.dispatchEvent(this.constructor.EVENT_UPDATED);
        return !this.isEmpty();
    }
    clear(value) {
        // this.value = this.constructor.EMPTY_VALUE;
        // this.dispatchEvent(this.constructor.EVENT_UPDATED);
        return this.write(this.constructor.EMPTY_VALUE);
    }
}
class ListType extends BasicType {
    clear() { return this.write([]); }
    write(value) {
        this.value.length = 0;
        this.add(...this.coerce(value));
        this.dispatchEvent(this.constructor.EVENT_UPDATED);
        return !this.isEmpty();
    }
    add(...values) {
        // ...
        this.dispatchEvent(this.constructor.EVENT_UPDATED);
    }
    remove(...values) {
        // ...
        this.dispatchEvent(this.constructor.EVENT_UPDATED);
    }
    toggle(...values) {
        // ...
        this.dispatchEvent(this.constructor.EVENT_UPDATED);
    }
    replace(...values) {
        // ...
        this.dispatchEvent(this.constructor.EVENT_UPDATED);
    }
}

class Mediator {

    constructor({ type, attribute, reference }) {

        this.type = type;
        this.attribute = attribute;
        this.reference = reference;

        this.type.addEventListener(
            BasicType.EVENT_UPDATED,
            () => this.updateFromType()
        );

    }

    write(value) {

        this.type.write(value);
        this.update();

    }

    updateFromType() {

        let {
            type,
            attribute,
            reference
        } = this;
        let element = reference.element();

        if (type.isEmpty()) {
            return attribute.clear(element);
        }

        return attribute.write(element, type.toString());

    }

    updateFromAttribute() {

        let {
            type,
            attribute,
            reference
        } = this;
        let element = reference.element();

        if (attribute.isEmpty(element)) {

            type.clear();
            return true;

        }

        return type.write(attribute.read(element));

    }

    read() {
        return this.type.read();
    }

    clear() {
        return this.type.clear();
    }

}

/*
factory.add("role", ListType, Attribute);
 */

class Factory {

    static get() {

        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;

    }

    constructor() {

        this.factories = Object.create(null);

    }

    addFactory(name, Type, Attr = AriaAttribute, override = false) {

        if (this.factories[name] && !override) {
            throw new Error("...");
        }

        this.factories[name] = (reference) => {

            return new Mediator({
                reference,
                type: new Type(),
                attribute: new Attr(name)
            });

        };

    }

    create(name, reference) {

        let factory = this.factories[name];

        if (!factory) {
            throw new ReferenceError("...");
        }

        return factory(reference);

    }

}
