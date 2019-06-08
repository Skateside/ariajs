import AriaNumber from "./AriaNumber.js";

export default class Integer extends AriaNumber {

    write(value) {
        return super.write(Math.floor(value));
    }

    read(value) {
        return Math.floor(super.read(value));
    }

};
