/**
 * The basic type that serves as a base for all WAI-ARIA attribute values.
 * @class BasicType
 */
export default class BasicType {

    /**
     * The value of an empty attribute.
     * @constant
     * @name EMPTY_VALUE
     * @type {String}
     */
    static get EMPTY_VALUE() {
        return "";
    }

    /**
     * The event triggered when a change occurs.
     * @constant
     * @name EVENT_UPDATED
     * @type {String}
     */
    static get EVENT_UPDATED() {
        return "updated";
    }

    /**
     * Converts the given value into a string. Null and undefined will be
     * converted into an empty string.
     *
     * @param  {?} value
     *         Value to convert into a string.
     * @return {String}
     *         String of the given value.
     */
    static stringify(value) {

        if (value === "" || value === null || value === undefined) {
            return "";
        }

        return value.toString();

    }

    /**
     * @constructs BasicType
     * @param      {?} [value=BasicType.EMPTY_VALUE]
     *             The initial value of the type.
     */
    constructor(value = this.constructor.EMPTY_VALUE) {

        /**
         * The current value.
         * @type {String}
         */
        this.value = value;

    }

    /**
     * Writes the value. A boolean is returned depending on whether or not the
     * value is empty.
     *
     * @param  {?} value
     *         Value to write.
     * @return {Boolean}
     *         true so that it can be used in Proxy set traps.
     */
    write(value) {

        this.value = value;
        this.announceUpdate();

        return true;

    }

    /**
     * Exposes {@link BasicType#value}.
     *
     * @return {?}
     *         The current value.
     */
    read() {
        return this.value;
    }

    /**
     * Sets {@link BasicType#value} to {@link BasicType.EMPTY_VALUE}.
     *
     * @return {Boolean}
     *         true because the value is empty.
     */
    clear() {
        return this.write(this.constructor.EMPTY_VALUE);
    }

    /**
     * Returns {@link BasicType#value} coerced as a string (see
     * {@link BasicType.stringify}).
     *
     * @return {String}
     *         Stringified version of {@link BasicType#value}.
     */
    toString() {
        return this.constructor.stringify(this.value);
    }

    /**
     * Checks to see if {@link BasicType#value} is empty.
     *
     * @return {Boolean}
     *         true if {@link BasicType#value} is empty, false otherwise.
     */
    isEmpty() {
        return this.value === this.constructor.EMPTY_VALUE;
    }

    /**
     * Sets {@link BasicType#observer} to the given observer.
     *
     * @param {Observer} observer
     *        Observer that will look for changes to the current type.
     */
    setObserver(observer) {

        /**
         * The observer for this type.
         * @type {Observer}
         */
        this.observer = observer;

    }

    /**
     * Triggers {@link BasicType.EVENT_UPDATED}.
     */
    announceUpdate() {

        if (!this.observer) {
            return;
        }

        this.observer.dispatchEvent(this.constructor.EVENT_UPDATED, {
            type: this
        });

    }

    /**
     * Adds a listener that will execute when this type is updated.
     *
     * @param {Function} listener
     *        Listener to execute.
     */
    observe(listener) {

        if (!this.observer) {
            return;
        }

        this.observer.addEventListener(this.constructor.EVENT_UPDATED, (e) => {
            this.dispatchListener(e, listener);
        });

    }

    /**
     * If the type detailed in the event is the current instance, the given
     * listener is executed and passed the event.
     *
     * @param {CustomEvent} event
     *        Event that was triggered.
     * @param {Function} listener
     *        Listener to execute.
     */
    dispatchListener(event, listener) {

        if (event.detail.type === this) {
            listener(event);
        }

    }

}
