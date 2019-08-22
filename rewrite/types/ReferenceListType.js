import ListType from "./ListType.js";
import Reference from "../Reference.js";

export default class ReferenceListType extends ListType {

    // write(value) {
    // }

    read() {
    }

    add(...values) {

        return super.add(
            ...Array.from(values, (value) => Reference.interpret(value))
        );

    }

    remove(...values) {

        return super.remove(
            ...Array.from(values, (value) => Reference.interpret(value))
        );

    }

    contains(value) {
        return super.contains(Reference.interpret(value));
    }

    toggle(value, force) {
        return super.toggle(Reference.interpret(value), force);
    }

}
