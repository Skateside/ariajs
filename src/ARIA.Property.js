/**
 * Handles basic WAI-ARIA properties.
 *
 * @class ARIA.Property
 */
ARIA.Property = ARIA.createClass(/** @lends ARIA.Property.prototype */{

    /**
     * @constructs ARIA.Property
     * @param      {Element} element
     *             Element whose attribute should be handled.
     * @param      {String} attribute
     *             Name of the attribute to handle.
     */
    init: function (element, attribute) {

        /**
         * Element whose attribute is being handled.
         * @type {Element}
         */
        this.element = element;

        /**
         * Attribute being handled.
         * @type {String}
         */
        this.attribute = attribute;

        // Things like ARIA.List work with interpretted values rather than just
        // the attribute value. If the attribute already exists, pass the value
        // to the set method to allow for that. As a bonus, this can filter out
        // invalid attribute values.
        if (ARIA.hasAttribute(element, attribute)) {
            this.set(ARIA.getAttribute(element, attribute));
        }

    },

    /**
     * Interprets the given value so it can be set.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {String}
     *         String based on the value.
     */
    interpret: function (value) {
        return ARIA.Property.interpret(value);
    },

    /**
     * Helper function for dispatching an event using {@link ARIA.trigger} which
     * automatically passes {@link ARIA.Property#element} and
     * {@link ARIA.Property#attribute} to the event details.
     *
     * @param  {String} event
     *         Name of the event to dispatch.
     * @param  {Object} [detail]
     *         Optional additional details.
     * @return {Event}
     *         Dispatched event.
     */
    trigger: function (event, detail) {

        return ARIA.trigger(event, objectAssign({
            element: this.element,
            attribute: this.attribute
        }, detail));

    },

    /**
     * Gets the value of {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element} and interprets it (see
     * {@link ARIA.Property#interpret}) before returning it. If the element
     * doesn't have the attribute, null is returned.
     *
     * @return {String|null}
     *         Interpretted value of {@link ARIA.Property#attribute} or null if
     *         the attribute is not set.
     * @fires  ARIA.Property#preget
     * @fires  ARIA.Property#postget
     */
    get: function () {

        var preEvent = this.trigger(ARIA.EVENT_PRE_GET);
        var element = this.element;
        var attribute = this.attribute;
        var value;

        if (!preEvent.defaultPrevented) {

            value = (
                ARIA.hasAttribute(element, attribute)
                ? this.interpret(ARIA.getAttribute(element, attribute))
                : null
            );
            this.trigger(ARIA.EVENT_POST_GET, {
                value: value
            });

        }

        return value;

    },

    /**
     * Sets the value of {@link ARIA.Property#attribute} on
     * {@link ARIA.Property#element} to the given value once it's been
     * interpretted (see {@link ARIA.Property#interpret}). If the value is
     * interpretted as an empty string, the attribute is removed using
     * {@link ARIA.Property#remove}.
     *
     * @param {?} value
     *        Value to set.
     * @fires ARIA.Property#preset
     * @fires ARIA.Property#postset
     */
    set: function (value) {

        var interpretted = this.interpret(value);
        var eventData = {
            raw: value,
            value: interpretted
        };
        var preEvent = this.trigger(ARIA.EVENT_PRE_SET, eventData);

        if (!preEvent.defaultPrevented) {

            if (interpretted === "") {
                this.remove();
            } else {
                ARIA.setAttribute(this.element, this.attribute, interpretted);
            }

            this.trigger(ARIA.EVENT_POST_SET, eventData);

        }

    },

    /**
     * Removes {@link ARIA.Property#attribute} from
     * {@link ARIA.Property#element}.
     *
     * @fires ARIA.Property#preremove
     * @fires ARIA.Property#postremove
     */
    remove: function () {

        var preEvent = this.trigger(ARIA.EVENT_PRE_REMOVE);

        if (!preEvent.defaultPrevented) {

            ARIA.removeAttribute(this.element, this.attribute);
            this.trigger(ARIA.EVENT_POST_REMOVE);

        }

    },

    /**
     * Returns the value of {@link ARIA.Property#attribute} as a string. See
     * {@link ARIA.Property#get}.
     *
     * @return {String}
     *         Value of the attribute.
     */
    toString: function () {
        return ARIA.getAttribute(this.element, this.attribute) || "";
    }

});

/**
 * Interprets the given value so it can be set. This is used to power
 * {@link ARIA.Property#interpret} while also being exposed so other functions
 * and classes can use it.
 *
 * @param  {?} value
 *         Value to interpret.
 * @return {String}
 *         String based on the value.
 */
ARIA.Property.interpret = interpretString;

/**
 * Name of the {@link ARIA.Property#preset} event.
 * @type {String}
 */
ARIA.EVENT_PRE_SET = "ariajs-pre-set";
/**
 * Event triggered before setting a WAI-ARIA property with
 * {@link ARIA.Property#set}. If the default action of this event is prevented,
 * the value is not set.
 *
 * @event    ARIA.Property#preset
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element that will have the attribute value set.
 * @property {String} detail.attribute
 *           Name of the attribute that will be set.
 * @property {String} detail.raw
 *           Raw value for to set on the value.
 * @property {Array<Element>|Array<String>|Element|Number|String} detail.value
 *           Version of the value after it has been passed through
 *           {@link ARIA.Property#interpret}. This is the value that will be set
 *           on the attribute.
 */

/**
 * Name of the {@link ARIA.Property#postset} event.
 * @type {String}
 */
ARIA.EVENT_POST_SET = "ariajs-post-set";
/**
 * Event triggered after setting a WAI-ARIA property with
 * {@link ARIA.Property#set}.
 *
 * @event    ARIA.Property#postset
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element that had the attribute value set.
 * @property {String} detail.attribute
 *           Name of the attribute that was set.
 * @property {String} detail.raw
 *           Raw value of the attribute.
 * @property {Array<Element>|Array<String>|Element|Number|String} detail.value
 *           Version of the value after it has been passed through
 *           {@link ARIA.Property#interpret}.
 */

/**
 * Name of the {@link ARIA.Property#preget} event.
 * @type {String}
 */
ARIA.EVENT_PRE_GET = "ariajs-pre-get";
/**
 * Event triggered before getting a WAI-ARIA property with
 * {@link ARIA.Property#get}. If the default action of this event is prevented,
 * the value is not retrieved.
 *
 * @event    ARIA.Property#preget
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute value should be retrieved.
 * @property {String} detail.attribute
 *           Name of the attribute whose value should be retrieved.
 */

/**
 * Name of the {@link ARIA.Property#postget} event.
 * @type {String}
 */
ARIA.EVENT_POST_GET = "ariajs-post-get";
/**
 * Event triggered before getting a WAI-ARIA property with
 * {@link ARIA.Property#get}.
 *
 * @event    ARIA.Property#postget
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute value should be retrieved.
 * @property {String} detail.attribute
 *           Name of the attribute whose value should be retrieved.
 * @property {?} detail.value
 *           The value of the attribute after being passed through
 *           {@link ARIA.Property#interpret}. If the element does not have the
 *           attribute, this value will be null.
 */

/**
 * Name of the {@link ARIA.Property#preremove} event.
 * @type {String}
 */
ARIA.EVENT_PRE_REMOVE = "ariajs-pre-remove";
/**
 * Event triggered before removing a WAI-ARIA attribute using
 * {@link ARIA.Property#remove}. If the default is prevented, the attribute is
 * not removed.
 *
 * @event    ARIA.Property#preremove
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute should be removed.
 * @property {String} detail.attribute
 *           Name of the attribute to remove.
 */

/**
 * Name of the {@link ARIA.Property#postremove} event.
 * @type {String}
 */
ARIA.EVENT_POST_REMOVE = "ariajs-post-remove";
/**
 * Event triggered after removing a WAI-ARIA attribute using
 * {@link ARIA.Property#remove}.
 *
 * @event    ARIA.Property#postremove
 * @type     {Event}
 * @property {Object} detail
 *           Event details.
 * @property {Element} detail.element
 *           Element whose attribute should be removed.
 * @property {String} detail.attribute
 *           Name of the attribute to remove.
 */
