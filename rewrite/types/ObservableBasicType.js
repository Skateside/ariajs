import BasicType from "./BasicType.js";

/**
 * Adds observer functionality to {@link BasicType}.
 * @class ObservableBasicType
 * @extends BasicType
 */
export default class ObservableBasicType extends BasicType {

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
     * Sets {@link ObservableBasicType#observer} to the given observer.
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
     * @inheritDoc
     */
    write(value) {

        let written = super.write(value);

        this.announceUpdate();

        return written;

    }

    /**
     * Triggers {@link ObservableBasicType.EVENT_UPDATED}.
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
