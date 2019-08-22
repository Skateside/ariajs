import BasicType from "./BasicType.js";
import Reference from "../Reference.js";

export default class ReferenceType extends BasicType {

    constructor() {
        super(new Reference(null));
    }

    write(value) {
        super.write(Reference.interpret(value));
    }

    read() {
        return this.value.identify();
    }

}
