import ListType from "./ListType.js";
import Reference from "~/references/Reference.js";

/**
 * Handles a list of references.
 * @class ReferenceListType
 * @extends ListType
 */
export default class ReferenceListType extends ListType {

    /**
     * @inheritDoc
     */
    add(...values) {
        return super.add(...this.interpretValues(values));
    }

    /**
     * @inheritDoc
     */
    remove(...values) {
        return super.remove(...this.interpretValues(values));
    }

    /**
     * Interprets the values anc converts any nested arrays so there is only a
     * flat array.
     *
     * @private
     * @param   {Array} values
     *          Values to coerce.
     * @return  {Array}
     *          Array of coerced values.
     */
    interpretValues(values) {

        return values
            .map((value) => this.coerceValue(value))
            .flat();

    }

    /**
     * Coerves a value using {@link Reference.interpret}.
     *
     * @private
     * @param   {?} value
     *          Value to coerce.
     * @return  {Reference[]}
     *          Array of Reference instances.
     */
    coerceValue(value) {

        return this
            .coerce(value)
            .map((coerced) => Reference.interpret(coerced));

    }

    /**
     * @inheritDoc
     */
    contains(value) {
        return super.contains(Reference.interpret(value));
    }

    /**
     * @inheritDoc
     */
    toggle(value, force) {
        return super.toggle(Reference.interpret(value), force);
    }

    /**
     * @inheritDoc
     */
    replace(oldValue, newValue) {

        return super.replace(
            Reference.interpret(oldValue),
            Reference.interpret(newValue)
        );

    }

    /**
     * @inheritDoc
     */
    item(index) {

        let item = super.item(index);

        return (
            item
            ? item.element()
            : null
        );

    }

}
