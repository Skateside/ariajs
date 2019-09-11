import Facade from "./Facade.js";

export default class ListFacade extends Facade {

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

    constructor(source, methods = ListFacade.facadeMethods) {

        super(source, methods);
        this.source = source;

        return new Proxy(this, {
            get: this.get.bind(this)
        });

    }

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
