import Facade from "./Facade.js";
import Factory from "~/Factory.js";
import Mediator from "~/Mediator.js";
import AriaAttribute from "~/attributes/AriaAttribute.js";

export default class MediatorFacade extends Facade {

    constructor(source) {

        super(source, []);
        this.source = source;

        return new Proxy(source, {
            get: this.get.bind(this),
            set: this.set.bind(this),
            deleteProperty: this.deleteProperty.bind(this)
        });

    }

    get(target, name) {

        let property = this.lookup(target, name);

        if (Mediator.isMediator(property)) {
            return property.read();
        }

        return property;

    }

    set(target, name, value) {

        let property = this.lookup(target, name);

        if (Mediator.isMediator(property)) {
            return property.write(value);
        }

        target[name] = value;

        return true;

    }

    deleteProperty(target, name) {

        let property = this.lookup(target, name);

        if (Mediator.isMediator(property)) {
            return property.clear();
        }

        delete target[name];
        return true;

    }

    lookup(object, property) {

        // Most of our properties will be Mediator instances and therefore
        // truthy. Fallback to a check for someone setting a falsy value.
        if (
            object[property]
            || Object.prototype.hasOwnProperty.call(object, property)
        ) {
            return object[property];
        }

        let name = Factory.get().recognises(
            property,
            AriaAttribute.prefix(property)
        );

        if (!name) {
            return;
        }

        let value = this.build(name);
        object[property] = value;
        return value;

    }

    build(property) {

        let value = this.values[property];

        if (!value) {

            value = Factory.get().create(property, this.source);
            this.values[property] = value;

        }

        return value;

    }

}
