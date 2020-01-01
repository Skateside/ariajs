import StateType from "./StateType.js";

/**
 * Handles true/false/undefined states.
 * @class UndefinedStateType
 * @extends StateType
 */
export default class UndefinedStateType extends StateType {

    /**
     * @inheritDoc
     */
    coerce(value) {

        return (
            (value === undefined || (/^undefined$/i).test(value))
            ? "undefined"
            : super.coerce(value)
        );

    }

    /**
     * @inheritDoc
     */
    read() {

        return (
            (
                this.value === "undefined"
                || this.value === this.constructor.EMPTY_VALUE
            )
            ? undefined
            : super.read()
        );

    }

}
