/**
 * The sandbox allows ARIA.js to be extended.
 * @class Sandbox
 */
export default class Sandbox {

    /**
     * Objects that have been registered with the sandbox.
     * @type {Object}
     */
    static registeredModules = {};

    /**
     * The key for the register property. This property will allow you to
     * register new modules for the sandbox.
     * @type {Symbol}
     */
    static register = Symbol("register");

    /**
     * Uses the sandbox. This has the alias {@link Aria.plugin}.
     *
     * @param  {Function} plugin
     *         Function to execute with the sandbox.
     * @return {?}
     *         Return value of the given plugin paramter.
     * @throws {TypeError}
     *         The plugin parameter must be a function.
     */
    static use(plugin) {

        if (typeof plugin !== "function") {
            throw new TypeError("plugin must be a function");
        }

        return plugin(new this());

    }

    /**
     * @constructs Sandbox
     * @return     {Object}
     *             The sandbox items and a function that can register new
     *             modules.
     */
    constructor() {

        return {
            ...this.constructor.registeredModules,
            ...{
                [this.constructor.register]: this.register.bind(this)
            }
        };

    }

    /**
     * Registers a new module for the sandbox. Modules can be overridden without
     * any error being thrown.
     *
     * @param  {Object|String} name
     *         Either an object of names to modules to register or the name of
     *         an individual module to register.
     * @param  {Object} [module]
     *         Module to register.
     * @throws {Error}
     *         The given name cannot be {@link Sandbox.register}.
     */
    register(name, module) {

        if (name && typeof name === "object" && !Array.isArray(name)) {

            return Object
                .entries(name)
                .forEach(([key, value]) => this.register(key, value));

        }

        if (name === this.constructor.register) {
            throw new Error("This property would be overridden.");
        }

        this.constructor.registeredModules[name] = module;

    }

}
