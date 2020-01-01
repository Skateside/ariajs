import ObservableBasicType from "./ObservableBasicType.js";
import Reference from "~/references/Reference.js";

/**
 * Handles references.
 * @class ReferenceType
 * @extends ObservableBasicType
 */
export default class ReferenceType extends ObservableBasicType {

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
