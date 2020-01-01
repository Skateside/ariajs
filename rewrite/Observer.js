/**
 * A simple observer.
 * @class Observer
 */
export default class Observer {

    /**
     * @constructs Observer
     * @param      {Element} [element=document.createElement("div")]
     *             The DOM element that will handle listeners. If ommitted, a
     *             dummy DOM element is created.
     */
    constructor(element = document.createElement("div")) {

        /**
         * The element that will handle event listeners.
         * @type {Element}
         */
        this.element = element;

    }

    /**
     * Adds an event listener.
     *
     * @param {String} name
     *        Name of the event to listen to.
     * @param {Function} handler
     *        Function to execute when the event triggers.
     */
    addEventListener(name, handler) {
        this.element.addEventListener(name, handler);
    }

    /**
     * Removes an event listener.
     *
     * @param {String} name
     *        Name of the event from which to remove a listener.
     * @param {Function} handler
     *        Function to remove from the event.
     */
    removeEventListener(name, handler) {
        this.element.removeEventListener(name, handler);
    }

    /**
     * Creates a CustomEvent with the optional given detail.
     *
     * @param  {String} name
     *         Name of the event to create.
     * @param  {?} [detail]
     *         Optional detail for the event.
     * @return {CustomEvent}
     *         Created custom event.
     */
    createEvent(name, detail) {

        return new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail
        });

    }

    /**
     * Dispatches the given event. If the event is a string, it is passed to
     * {@link Observer#createEvent} and the detail parameter is passed as well.
     * If the event is a CustomEvent, the detail parameter is ignored.
     *
     * @param  {CustomEvent|String} event
     *         Either the event or the name of the event.
     * @param  {?} [detail]
     *         Optional detail, ignored if the event parameter was a
     *         CustomEvent.
     * @return {CustomEvent}
     *         The event that was dispatched.
     */
    dispatchEvent(event, detail) {

        if (typeof event === "string") {
            event = this.createEvent(event, detail);
        }

        this.element.dispatchEvent(event);

        return event;

    }

}
