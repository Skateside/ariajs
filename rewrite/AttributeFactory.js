export default class AttributeFactory {

    static get OVERRIDE() {
        return true;
    }

    constructor() {
        this.factories = Object.create(null);
    }

    addFactory(name, Value, isOverride = false) {

        let factories = this.factories;
        let normal = Name.create(name);
// BUG: Name is undefined

        if (!factories[normal] || isOverride) {
            factories[normal] = () => new Attribute(normal, new Value());
        }

        return this;

    }

    addFactories(factories, isOverride = false) {

        if (!Array.isArray(factories)) {
            factories = Object.entries(factories);
        }

        factories.forEach(([name, Value]) => {
            this.addFactory(name, Value, isOverride)
        });

    }

}
