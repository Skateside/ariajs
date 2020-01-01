import StateType from "./StateType.js";

export default class UndefinedStateType extends StateType {

    coerce(value) {

        return (
            (value === undefined || (/^undefined$/i).test(value))
            ? "undefined"
            : super.coerce(value)
        );

    }

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
