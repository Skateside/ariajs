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

        /**
         * We set this flag when we're updating to prevent an updating loop.
         * @type {Boolean}
         */
        this.isUpdating = false;

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
        return this.type.write(value);
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

        let cleared = this.type.clear();

        this.updateFromType();

        return cleared;

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

        if (this.isUpdating) {
            return;
        }

        this.isUpdating = true;

        if (type.isEmpty()) {
            return attribute.clear(element);
        }

        let written = attribute.write(element, type.toString());

        this.isUpdating = false;

        return written;

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

        if (this.isUpdating) {
            return;
        }

        this.isUpdating = true;

        if (attribute.isEmpty(element)) {
            return type.clear();
        }

        let written = type.write(attribute.read(element));

        this.isUpdating = false;

        return written;

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
