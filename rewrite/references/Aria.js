import MediatorFacade from "~/facades/MediatorFacade.js";
import Reference from "./Reference.js";

export default class Aria extends Reference {

    constructor(element) {

        super(element);

        this.observations = Object.create(null);
        this.observer = this.makeObserver();

        return new MediatorFacade(this);

    }

    makeObserver() {

        let observer = new MutationObserver((mutations) => {
            this.checkMutations(mutations);
        });

        observer.observe(this.reference, {
            attributes: true
        });

        return observer;

    }

    checkMutations(mutations) {

        mutations.forEach(({ attributeName }) => {
            this.checkMutation(attributeName);
        });

    }

    checkMutation(attributeName) {

        let observation = this.observations[attributeName];

        if (!observation) {
            return;
        }

        observation();

    }

    observe(attributeName, handler) {
        this.observations[attributeName] = handler;
    }

}
