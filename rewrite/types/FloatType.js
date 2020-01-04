import BasicType from "./BasicType.js";

/**
 * Handles float values.
 * @class FloatType
 * @extends BasicType
 */
export default class FloatType extends BasicType {

    /**
     * If the given value is not numeric, the value is replaced with
     * {@link BasicType.EMPTY_VALUE}.
     * @inheritDoc
     */
    write(value) {

        let number = Number(value);

        if (Number.isNaN(number)) {
            number = this.constructor.EMPTY_VALUE;
        }

        return super.write(number);

    }

}
