import ObservableBasicType from "./ObservableBasicType.js";

/**
 * Handles simple true/false states.
 * @class StateType
 * @extends ObservableBasicType
 */
export default class StateType extends ObservableBasicType {

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
