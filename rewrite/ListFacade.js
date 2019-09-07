import Facade from "./Facade.js";

let facadeMethods = [
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

export default class ListFacade extends Facade {

    constructor(source, methods = facadeMethods) {

        super(source, methods);

        return new Proxy(this, {

            get(target, name) {

                if (name === "length") {
                    return source.size();
                }

                if (source.coerceIndex(name) !== null) {
                    return target.item(name);
                }

                return target[name];

            }

        });

    }

}
