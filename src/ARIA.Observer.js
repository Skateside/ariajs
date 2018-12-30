/**
 * A map for keeping all dummy elements in {@link ARIA.Observer}.
 * @private
 * @type {WeakMap}
 */
var observerMap = new WeakMap();

/**
 * Creates observers.
 *
 * @class ARIA.Observer
 */
ARIA.Observer = ARIA.createClass(/** @lends ARIA.Observer.prototype */{

    /**
     * Gets the element that will dispatch events for this observer.
     *
     * @return {Element}
     *         Element that will dispatch events.
     */
    getEventElement: function () {

        var dummy = observerMap.get(this);

        if (!dummy) {

            dummy = document.createElement("div");
            observerMap.set(this, dummy);

        }

        return dummy;

    },

    /**
     * Creates a custom event.
     *
     * @param  {String} name
     *         Name of the event to create.
     * @param  {?} [detail]
     *         Optional detail to be passed to the event.
     * @return {CustomEvent}
     *         Custom event.
     */
    createEvent: function (name, detail) {

        return new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail: detail
        });

    },

    /**
     * Dispatches the given event on the element that comes from
     * {@link ARIA.Observer#getEventElement}. If the event parameter is a
     * string, it is passed to {@link ARIA.Observer#createEvent}.
     *
     * @param  {Event|string} event
     *         Either the event to dispatch or the name of the event to
     *         dispatch.
     * @param  {?} [detail]
     *         Optional detail for the event. This is only used if the event
     *         parameter is a string.
     * @return {Event}
     *         The event that was dispatched.
     */
    dispatchEvent: function (event, detail) {

        if (typeof event === "string") {
            event = this.createEvent(event, detail);
        }

        this.getEventElement().dispatchEvent(event);

        return event;

    },

    /**
     * Adds an event listener to the element that comes from
     * {@link ARIA.Observer#getEventElement}.
     *
     * @param {String} name
     *        Name of the event to which a listener should be added.
     * @param {Function} handler
     *        Function to execute when the event is dispatched.
     */
    addEventListener: function (name, handler) {
        this.getEventElement().addEventListener(name, handler);
    },

    /**
     * Removes an event listener from the element that comes from
     * {@link ARIA.Observer#getEventElement}.
     *
     * @param {String} name
     *        Name of the event from which a listener should be removed.
     * @param {Function} handler
     *        Function to remove from the event listener.
     */
    removeEventListener: function (name, handler) {
        this.getEventElement().removeEventListener(name, handler);
    }

});

// Create a fall-back for browsers that don't allow CustomEvent to be used as a
// constructor.
try {

    var event = new CustomEvent("my-custom-event", {
        bubbles: true,
        cancelable: true,
        detail: {}
    });

} catch (ignore) {

    ARIA.Observer.prototype.createEvent = function (name, detail) {

        var event = document.createEvent("CustomEvent");

        event.initCustomEvent(name, true, true, detail);

        return event;

    };

}

/**
 * Instance of {@link ARIA.Observer} that is used by {@link ARIA.trigger},
 * {@link ARIA.on} and {@link ARIA.off}.
 * @type {ARIA.Observer}
 */
ARIA.observer = new ARIA.Observer();

/**
 * Dispatches an event with {@link ARIA.observer}.
 *
 * @param  {String} name
 *         Name of the event to dispatch.
 * @param  {?} [detail]
 *         Optional detail for the event.
 * @return {Event}
 *         Event that was dispatched.
 */
ARIA.trigger = function (name, detail) {
    return ARIA.observer.dispatchEvent(name, detail);
};

/**
 * Adds a handler to the given event.
 *
 * @param {String} name
 *        Name of the event to listen for.
 * @param {Function} handler
 *        Handler to execute when the event is dispatched.
 */
ARIA.on = function (name, handler) {
    ARIA.observer.addEventListener(name, handler);
};

/**
 * Revmoes a handler from the given event.
 *
 * @param {String} name
 *        Name of the event to stop listening to.
 * @param {Function} handler
 *        Handler to remove from the event.
 */
ARIA.off = function (name, handler) {
    ARIA.observer.removeEventListener(name, handler);
};
