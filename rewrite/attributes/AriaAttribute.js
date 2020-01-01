import Attribute from "./Attribute.js";

/**
 * A version of {@link Attribute} that handles WAI-ARIA attributes.
 * @class AriaAttribute
 * @extends Attribute
 */
export default class AriaAttribute extends Attribute {

    /**
     * The "aria-" prefix.
     * @name PREFIX
     * @constant
     * @type {String}
     */
    static get PREFIX() {
        return "aria-";
    }

    /**
     * Prefixes the given attribute name with {@link AriaAttribute.PREFIX} if
     * necessary. The attribute name is validated using
     * {@link Attribute.validateName} before being prefixed.
     *
     * @param  {String} name
     *         Attribute to prefix.
     * @return {String}
     *         Prefixed attribute.
     */
    static prefix(name) {

        this.validateName(name);

        let prefix = AriaAttribute.PREFIX;

        if (!name.startsWith(prefix)) {
            name = prefix + name;
        }

        return name;

    }

    /**
     * Removes the {@link AriaAttribute.PREFIX} prefix from the given attribute
     * name, if it has one. The name is passed through
     * {@link Attribute.validateName} before the prefix is removed.
     *
     * @param  {String} name
     *         Attribute name to unprefix.
     * @return {String}
     *         Unprefixed name of the attribute.
     */
    static unprefix(name) {

        this.validateName(name);

        let prefix = AriaAttribute.PREFIX;

        if (name.startsWith(prefix)) {
            name = name.slice(prefix.length);
        }

        return name;

    }

    /**
     * Creates a cached version of {@link AriaAttribute}. The given name will be
     * automatically prefixed with {@link AriaAttribute.prefix}.
     *
     * @param  {String} name
     *         Name of the attribute.
     * @return {AriaAttribute}
     *         Cached version of AriaAttribute.
     */
    static create(name) {
        return super.create(this.prefix(name));
    }

    /**
     * @constructs AriaAttribute
     * @param      {String} attributeName
     *             Name of the attribute.
     * @throws     {Error}
     *             The given name mus start with {@link AriaAttribute.PREFIX}.
     */
    constructor(attributeName) {

        super(attributeName);

        let prefix = this.constructor.PREFIX;

        if (!attributeName.startsWith(prefix)) {

            throw new Error(
                "AriaAttribute constructor must be passed an attribute name "
                + `starting with '${prefix}', '${attributeName}' given.`
            );

        }

    }

}
