export default class Observer {

    constructor(eventElement = document.createElement("div")) {
        this.eventElement = eventElement;
    }

    addEventListener(name, handler) {
        this.eventElement.addEventListener(name, handler);
    }

    removeEventListener(name, handler) {
        this.eventElement.removeEventListener(name, handler);
    }

    createEvent(name, detail) {

        return new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail
        });

    }

    dispatchEvent(event, detail) {

        if (typeof event === "string") {
            event = this.createEvent(event, detail);
        }

        this.eventElement.dispatchEvent(event);

        return event;

    }

}
