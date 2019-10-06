export default class Sandbox {

    static register = {};

    static use(plugin) {

        if (typeof plugin !== "function") {
            throw new TypeError("plugin must be a function");
        }

        return plugin(new this());

    }

    constructor() {

        return {
            ...this.constructor.register,
            ...{
                register: this.register.bind(this)
            }
        };

    }

    register(name, module) {

        if (name && typeof name === "object" && !Array.isArray(name)) {

            return Object
                .entries(name)
                .forEach(([key, value]) => this.register(key, value));

        }

        this.constructor.register[name] = module;

    }

}
