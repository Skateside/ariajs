import {
    prefix,
    unprefix,
    addTranslation
} from "./util.js";

export default class Factory {

    constructor() {
        this.factories = Object.create(null);
    }

    lookup(attribute) {

        let {
            factories
        } = this;

        return factories[attribute] || factories[unprefix(attribute)];

    }

    run(attribute, element) {

        let factory = this.lookup(attribute);

        if (!factory) {

            throw new ReferenceError(
                attribute + " is not a recognised factory"
            );

        }

        return factory(element);

    }

    make(attribute, Constructor) {
        return (element) => new Constructor(attribute, element);
    }

    add(attribute, Constructor) {
        this.factories[attribute] = this.make(prefix(attribute), Constructor);
    }

    alias(source, alias) {

        let factory = this.lookup(source);

        if (!factory) {
            throw new ReferenceError(source + " is not a recognised factory");
        }

        let unSource = unprefix(source);
        let unAlias = unprefix(alias);

        addTranslation(unAlias, unSource);
        this.factories[unAlias] = this.factories[unSource];

    }

}
