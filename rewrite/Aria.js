import AriaAttribute from "./attributes/AriaAttribute.js";
import Factory from "./Factory.js";
import Mediator from "./Mediator.js";

export default class Aria {

    constructor(element) {

        this.element = element;
        this.values = Object.create(null);
        this.observer = this.makeObserver();

        return new Proxy(this, {
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

        if (Object.prototype.hasOwnProperty.call(object, property)) {
            return object[property];
        }

        let value = this.build(property);

        if (value) {

            object[property] = value;
            return value;

        }

    }

    build(property) {

        let instance = this.instances[property];

        if (!instance) {

            instance = Factory.get().create(property, this.element);
            this.instances[property] = instance;

        }

        return instance;

    }

    makeObserver() {

        let observer = new MutationObserver((mutations) => {
            this.checkMutations(mutations);
        });

        observer.observe(this.element, {
            attributes: true
        });

        return observer;

    }

    checkMutations(mutations) {

        mutations.forEach(({ type, attributeName = "" }) => {
            this.checkMutation(type, attributeName);
        });

    }

    checkMutation(type, attributeName) {

        if (type !== "attributes" || !attributeName) {
            return;
        }

        let instance = this.build(AriaAttribute.unprefix(attributeName));

        if (Mediator.isMediator(instance)) {
            instance.updateFromAttribute();
        }

    }

}
