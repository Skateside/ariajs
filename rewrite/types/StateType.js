import BasicType from "./BasicType.js";

/**
 * Handles simple true/false states.
 * @class StateType
 * @extends BasicType
 */
export default class StateType extends BasicType {

    /**
     * Coerces the given value into a boolean.
     *
     * @param  {?} value
     *         Value to coerce.
     * @return {Boolean}
     *         Coerced boolean.
     */
    coerce(value) {

        if (value === this.constructor.EMPTY_VALUE) {
            return false;
        }

        return (/^true$/i).test(this.constructor.stringify(value));

    }

    /**
     * @inheritDoc
     */
    write(value) {
        return super.write(this.coerce(value));
    }

    /**
     * @inheritDoc
     */
    read() {
        return Boolean(this.value);
    }

}
