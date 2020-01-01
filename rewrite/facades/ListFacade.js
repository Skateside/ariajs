import Facade from "./Facade.js";

/**
 * A version of {@link Facade} that makes the given object appear as a list.
 */
export default class ListFacade extends Facade {

    /**
     * Name of the methods to expose.
     * @type {Array}
     */
    static facadeMethods = [
        "add",
        "remove",
        "item",
        "toggle",
        "contains",
        "replace",
        "forEach",
        "toString",
        "keys",
        "values",
        "entries",
        Symbol.iterator
    ];

    /**
     * @inheritDoc
     */
    constructor(source, methods = ListFacade.facadeMethods) {

        super(source, methods);

        /**
         * The original source that has some methods exposed.
         * @type {Object}
         */
        this.source = source;

        return new Proxy(this, {
            get: this.get.bind(this)
        });

    }

    /**
     * Creates short-cuts for certain properties - "length" property is the
     * "size" method result of {@link ListFacade#source} and numeric properties
     * are automatically passed to the "item" method of
     * {@link ListFacade#source}.
     *
     * @param  {ListFacade} target
     *         The current instance.
     * @param  {String} name
     *         Name of the property to access.
     * @return {?}
     *         Either the length as a Number, the value of the item() method or
     *         the property from target.
     */
    get(target, name) {

        let {
            source
        } = this;

        if (name === "length") {
            return source.size();
        }

        if (source.coerceIndex(name) !== null) {
            return target.item(name);
        }

        return target[name];

    }

}
