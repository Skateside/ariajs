import ObservableBasicType from "./ObservableBasicType.js";
import Reference from "~/references/Reference.js";

export default class ReferenceType extends ObservableBasicType {

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
