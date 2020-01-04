/**
 * Combines instances of {@link Aria}, {@link Attribute} and
 * {@link BasicType} (or sub-classes).
 * @class Mediator
 */
export default class Mediator {

    /**
     * @constructs Mediator
     * @param      {Object} settings
     *             Settings for the Mediator.
     * @param      {BasicType} settings.type
     *             Type of value.
     * @param      {Attribute} settings.attribute
     *             Attribute on the element.
     * @param      {Aria} settings.reference
     *             Wrapped element.
     */
    constructor({ type, attribute, reference }) {

        /**
         * Type of value.
         * @type {BasicType}
         */
        this.type = type;

        /**
         * Attribute being modified.
         * @type {Attribute}
         */
        this.attribute = attribute;

        /**
         * Wrapped elemet.
         * @type {Aria}
         */
        this.reference = reference

        /**
         * A short-cut to the {@link Aria#element} value of
         * {@link Mediator#reference}.
         * @type {Element}
         */
        this.element = reference.element();

        type.observe(() => this.updateFromType());
        reference.observe(attribute.name(), () => this.updateFromAttribute());

        if (attribute.exists(this.element)) {
            this.updateFromAttribute();
        }

    }

    /**
     * Writes the value to {@link Mediator#type} (see {@link BasicType#write}).
     *
     * @param  {?} value
     *         Value to write.
     * @return {Boolean}
     *         true
     */
    write(value) {

        let written = this.type.write(value);

        this.updateFromType();

        return written;

    }

    /**
     * Reads the value from {@link Mediator#type} (see {@link BasicType#read}).
     *
     * @return {?}
     *         Value of the attribute.
     */
    read() {
        return this.type.read();
    }

    /**
     * Clears the value of {@link Mediator#type} (see {@link BasicType#clear}).
     *
     * @return {Boolean}
     *         true.
     */
    clear() {
        return this.type.clear();
    }

    /**
     * Updates {@link Mediator#attribute} because {@link Mediator#type} has been
     * updated. See {@link Attribute#write} for details about the return value.
     *
     * @return {Boolean}
     *         Result of writing the value.
     */
    updateFromType() {

        let {
            type,
            attribute,
            element
        } = this;

        if (type.isEmpty()) {
            return attribute.clear(element);
        }

        return attribute.write(element, type.toString());

    }

    /**
     * Updates {@link Mediator#type} because {@link Mediator#attribute} has been
     * updated. See {@link BasicType#write} for details about the return value.
     *
     * @return {Boolean}
     *         Result of writing the value.
     */
    updateFromAttribute() {

        let {
            type,
            attribute,
            element
        } = this;

        if (attribute.isEmpty(element)) {

            type.clear();
            return true;

        }

        return type.write(attribute.read(element));

    }

    /**
     * Checks to see if the given object is an instance of {@link Mediator}.
     *
     * @param  {Object} object
     *         Object to test.
     * @return {Boolean}
     *         true if the object is an instance of {@link Mediator}, false
     *         otherwise.
     */
    static isMediator(object) {
        return object instanceof this;
    }

}
