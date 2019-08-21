class StringType {

    constructor() {
        this.value = "";
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

}
