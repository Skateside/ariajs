import FloatType from "./FloatType.js";

/**
 * Handles integer values.
 * @class IntegerType
 * @extends FloatType
 */
export default class IntegerType extends FloatType {

    /**
     * Drops the decimal from the given value.
     * @inheritDoc
     */
    write(value) {
        return super.write(Math.floor(value));
    }

}
