import ObservableBasicType from "./ObservableBasicType.js";

/**
 * Handles float values.
 * @class FloatType
 * @extends ObservableBasicType
 */
export default class FloatType extends ObservableBasicType {

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
