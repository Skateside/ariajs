import BasicType from "./BasicType.js";
import Reference from "~/references/Reference.js";

/**
 * Handles references.
 * @class ReferenceType
 * @extends BasicType
 */
export default class ReferenceType extends BasicType {

    /**
     * @inheritDoc
     */
    write(value) {
        return super.write(Reference.interpret(value));
    }

    /**
     * @inheritDoc
     */
    read() {

        let value = this.value;

        return (
            Reference.isReference(value)
            ? value.element()
            : this.constructor.EMPTY_VALUE
        );

    }

}
