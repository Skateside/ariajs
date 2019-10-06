export default class BasicType {

    static get EMPTY_VALUE() {
        return "";
    }

    static stringify(value) {

        if (value === "" || value === null || value === undefined) {
            return "";
        }

        return value.toString();

    }

    constructor(value = this.constructor.EMPTY_VALUE) {
        this.value = value;
    }

    write(value) {

        this.value = value;

        return !this.isEmpty();

    }

    read() {
        return this.value;
    }

    clear() {
        return this.write(this.constructor.EMPTY_VALUE);
    }

    toString() {
        return this.constructor.stringify(this.value);
    }

    isEmpty() {
        return this.value === this.constructor.EMPTY_VALUE;
    }

}
