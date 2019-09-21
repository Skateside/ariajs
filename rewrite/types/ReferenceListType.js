import ListType from "./ListType.js";
import Reference from "../references/Reference.js";

export default class ReferenceListType extends ListType {

    add(...values) {
        return super.add(...this.interpretValues(values));
    }

    remove(...values) {
        return super.remove(...this.interpretValues(values));
    }

    interpretValues(values) {

        return values
            .map((value) => this.coerceValue(value))
            .flat();

    }

    coerceValue(value) {

        return this
            .coerce(value)
            .map((coerced) => Reference.interpret(coerced));

    }

    contains(value) {
        return super.contains(Reference.interpret(value));
    }

    toggle(value, force) {
        return super.toggle(Reference.interpret(value), force);
    }

    replace(oldValue, newValue) {

        return super.replace(
            Reference.interpret(oldValue),
            Reference.interpret(newValue)
        );

    }

    item(index) {

        let item = super.item(index);

        return (
            item
            ? item.element()
            : null
        );

    }

}
