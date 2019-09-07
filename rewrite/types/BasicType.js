import Observer from "../Observer.js";

export default class BasicType extends Observer {

    static get EMPTY_VALUE() {
        return "";
    }

    static get EVENT_UPDATED() {
        return "updated";
    }

    constructor(value = BasicType.EMPTY_VALUE) {

        super();

        this.value = value;

    }

    write(value) {

        this.value = value;
        this.dispatchEvent(this.constructor.EVENT_UPDATED);

        return !this.isEmpty();

    }

    read() {
        return this.value;
    }

    clear() {
        return this.write(this.constructor.EMPTY_VALUE);
    }

    toString() {
        return this.value.toString();
    }

    isEmpty() {
        return this.value === this.constructor.EMPTY_VALUE;
    }

}
