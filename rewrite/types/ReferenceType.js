import BasicType from "./BasicType.js";
import Reference from "../Reference.js";

export default class ReferenceType extends BasicType {

    write(value) {
        return super.write(Reference.interpret(value));
    }

    read() {

        let value = this.value;

        return (
            Reference.isReference(value)
            ? value.element()
            : this.constructor.EMPTY_VALUE
        );

    }

}
