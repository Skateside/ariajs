import Mediator from "./Mediator.js";
import Aria from "./references/Aria.js";
import BasicType from "./types/BasicType.js";

/**
 * Creates {@link Mediator} instances that combine a {@link Aria}, an
 * {@link Attribute} and a {@link BasicType} (or sub-class).
 * @class Factory
 */
export default class Factory {

    /**
     * A flag that can be passed to {@link Factory#add} to replace a factory.
     * @constant
     * @name OVERRIDE
     * @type {Boolean}
     */
    static get OVERRIDE() {
        return true;
    }

    /**
     * Gets an instance created as a singleton.
     *
     * @return {Factory}
     *         Factory singleton.
     */
    static get() {

        if (!this.instance) {

            /**
             * Factory singleton.
             * @type {Factory}
             */
            this.instance = new this();

        }

        return this.instance;

    }

    /**
     * @constructs Factory
     */
    constructor() {

        /**
         * Factories that have been created.
         * @type {[type]}
         */
        this.factories = Object.create(null);

    }

    /**
     * Sets the observer that can be passed to factories.
     *
     * @param {Observer} observer
     *        Observer to add.
     */
    setObserver(observer) {

        /**
         * Observer that is passed to factories.
         * @type {Observer}
         */
        this.observer = observer;

    }

    /**
     * Creates a factory.
     *
     * @param  {String} name
     *         Name of the factory to add.
     * @param  {BasicType} Type
     *         Type of value that will be used. The uninitialised class should
     *         be passed.
     * @param  {Attribute} Attr
     *         Attribute that will gain the type. The uninitialised class should
     *         be passed.
     * @param  {Boolean} [override=false]
     *         Optional flag for overriding an existing factory.
     * @throws {TypeError}
     *         The name must be a non-empty string.
     * @throws {Error}
     *         Factories cannot be overridden without the override flag being
     *         passed as {@link Factory.OVERRIDE}.
     */
    add(name, Type, Attr, override = false) {

        if (typeof name !== "string" || !name) {
            throw new TypeError(`Invalid name '${name}'.`);
        }

        if (this.recognises(name) && override !== this.constructor.OVERRIDE) {
            throw new Error(`'${name}' factory already exists.`);
        }

        this.factories[name] = (reference) => {

            let type = new Type();
            type.setObserver(this.observer);

            return new Mediator({
                reference,
                type,
                attribute: Attr.create(name)
            });

        };

    }

    /**
     * Finds a {@link Mediator} from {@link Factory#factories} that matches one
     * of the given names. If no matches are found, undefined is returned.
     *
     * @param  {...String} names
     *         Names to look for.
     * @return {Mediator|undefined}
     *         Either a matching Mediator or undefined if no matches are found.
     */
    recognises(...names) {
        return names.find((name) => Boolean(this.factories[name]));
    }

    /**
     * Creates the factory that matches the given name and passes it the given
     * reference.
     *
     * @param  {String} name
     *         Name of the factory to create.
     * @param  {Aria} reference
     *         Reference to pass to the factory.
     * @return {Mediator}
     *         Created factory.
     * @throws {ReferenceError}
     *         The name must match an existing factory.
     * @throws {TypeError}
     *         The reference must be an instance of Aria.
     */
    create(name, reference) {

        let factory = this.factories[name];

        if (!factory) {
            throw new ReferenceError(`Unable to find the '${name}' factory.`);
        }

        if (!Aria.isAriaReference(reference)) {
            throw new TypeError("Given reference must be an instance of Aria.");
        }

        return factory(reference);

    }

}
