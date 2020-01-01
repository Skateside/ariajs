import Facade from "./Facade.js";
import Factory from "~/Factory.js";
import Mediator from "~/Mediator.js";
import AriaAttribute from "~/attributes/AriaAttribute.js";

/**
 * The facade for an Aria element. Used by {@link Aria}.
 * @class MediatorFacade
 * @extends Facade
 */
export default class MediatorFacade extends Facade {

    /**
     * @inheritDoc
     */
    constructor(source) {

        super(source, []);

        /**
         * The original source that has some methods exposed.
         * @type {Object}
         */
        this.source = source;

        /**
         * Cache of properties built using {@link MediatorFacade#builfd}.
         * @type {Object}
         */
        this.values = Object.create(null);

        return new Proxy(source, {
            get: this.get.bind(this),
            set: this.set.bind(this),
            deleteProperty: this.deleteProperty.bind(this)
        });

    }

    /**
     * If the property accesses a {@link Mediator}, the Mediator's read() method
     * is executed and that value returned. The property name is passed through
     * {@link MediatorFacade#lookup}.
     *
     * @param  {Object} target
     *         Target whose property will be accessed.
     * @param  {String} name
     *         Name of the property to access.
     * @return {?}
     *         Value.
     */
    get(target, name) {

        let property = this.lookup(target, name);

        if (Mediator.isMediator(property)) {
            return property.read();
        }

        return property;

    }

    /**
     * If the property references a {@link Mediator}, the value is passed to the
     * Mediator's write() method. The property name is passed through
     * {@link MediatorFacade#lookup}.
     *
     * @param  {Object} target
     *         Object whose property should be set.
     * @param  {String} name
     *         Name of the property to set.
     * @param  {?} value
     *         Value to set.
     * @return {Boolean}
     *         true.
     */
    set(target, name, value) {

        let property = this.lookup(target, name);

        if (Mediator.isMediator(property)) {
            return property.write(value);
        }

        target[name] = value;

        return true;

    }

    /**
     * If the property references a {@link Mediator}, the Mediator's clear()
     * method is executed. The property name is passed through
     * {@link MediatorFacade#lookup}.
     *
     * @param  {Object} target
     *         Object whose property should be removed.
     * @param  {String} name
     *         Name of the property to remove.
     * @return {Boolean}
     *         true.
     */
    deleteProperty(target, name) {

        let property = this.lookup(target, name);

        if (Mediator.isMediator(property)) {
            return property.clear();
        }

        delete target[name];
        return true;

    }

    /**
     * Looks up the property from the oject. If the property doesn't exist, it
     * is created using {@link MediatorFacade#build}.
     *
     * @param  {Object} object
     *         Object whose property should be looked up.
     * @param  {String} property
     *         Property to access.
     * @return {?}
     *         The property or a {@link Mediator} of it.
     */
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

    /**
     * Builds the {@link Mediator} based on information given to the
     * {@link Factory} for the given property name. The value is cached to save
     * processing power.
     *
     * @param  {String} property
     *         Property to build.
     * @return {Mediator}
     *         Mediator for the property.
     */
    build(property) {

        let value = this.values[property];

        if (!value) {

            value = Factory.get().create(property, this.source);
            this.values[property] = value;

        }

        return value;

    }

}
