export default class BasicType {

    static get EMPTY_VALUE() {
        return "";
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
        this.value = this.constructor.EMPTY_VALUE;
    }

    toString() {
        return this.value.toString();
    }

    isEmpty() {
        return this.value === this.constructor.EMPTY_VALUE;
    }

    // static create(value) {
    //
    //     let type = new this()
    //
    //     type.write(value);
    //
    //     return type;
    //
    // }

}
