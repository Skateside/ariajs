export default class BasicType {

    constructor(value = "") {
        this.value = value;
    }

    write(value) {
        this.value = value;
    }

    read() {
        return this.value;
    }

    toString() {
        return this.value.toString();
    }

    static create(value) {

        let type = new this()

        type.write(raw);

        return type;

    }

}
