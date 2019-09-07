import BasicType from "./BasicType.js";
import Reference from "../Reference.js";

export default class ReferenceType extends BasicType {

    // constructor() {
    //     super(new Reference(null));
    // }

    write(value) {
        return super.write(Reference.interpret(value));
    }

    read() {

        let value = this.value;

        return (
            (value instanceof Reference)
            ? value.element()
            : this.constructor.EMPTY_VALUE
        );

    }

    // isEmpty() {
    //     return this.read() === null;
    // }

}
