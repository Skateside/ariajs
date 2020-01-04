import MediatorFacade from "~/facades/MediatorFacade.js";
import Reference from "./Reference.js";

/**
 * A version of {@link Reference} that handles elements with WAI-ARIA
 * attributes.
 * @class Aria
 * @extends Reference
 * @global
 */
export default class Aria extends Reference {

    /**
     * @constructs Aria
     * @param      {Element} element
     *             Wrapped element.
     */
    constructor(element) {

        super(element);

        /**
         * Handlers for any attribute changes. This is how {@link Aria} will
         * know what to do when an attribute changes.
         * @type {Object}
         */
        this.observations = Object.create(null);

        /**
         * A MutationObserver that that listens for any attribute changes.
         * @type {MutationObserver}
         */
        this.observer = this.makeObserver();

        return new MediatorFacade(this);

    }

    /**
     * Makes a MutationObserver to listen for all attribute changes on
     * {@link Aria#reference}.
     *
     * @return {MutationObserver}
     *         A MutationObserver that listens for all atribute changes.
     */
    makeObserver() {

        let observer = new MutationObserver((mutations) => {
            this.checkMutations(mutations);
        });

        observer.observe(this.reference, {
            attributes: true
        });

        return observer;

    }

    /**
     * Checks the mutations that occurred when an attribute changes.
     *
     * @param {MutationRecord[]} mutations
     *        Mutation records.
     */
    checkMutations(mutations) {

        mutations.forEach(({ attributeName }) => {
            this.checkMutation(attributeName);
        });

    }

    /**
     * Checks to see if there's a mutation stored in {@link Aria#observations}
     * for the given attribute name. If there is, it is executed.
     *
     * @param {String} attributeName
     *        Name of the attribute that was observed changing.
     */
    checkMutation(attributeName) {

        let observation = this.observations[attributeName];

        if (!observation) {
            return;
        }

        observation();

    }

    /**
     * Adds an observation to {@link Aria#observations} for the given attribute
     * name.
     *
     * @param {String} attributeName
     *        Attribute name.
     * @param {Function} handler
     *        Function to execute when the given attribute changes.
     */
    observe(attributeName, handler) {
        this.observations[attributeName] = handler;
    }

    /**
     * Checks to see if the given object is an instnace of {@link Aria}.
     *
     * @param  {Object} object
     *         Object to test.
     * @return {Boolean}
     *         true if the given object is an instance of {@link Aria}, false
     *         otherwise.
     */
    static isAriaReference(object) {
        return object instanceof this;
    }

}
