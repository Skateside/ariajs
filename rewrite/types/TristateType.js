import StateType from "./StateType.js";

/**
 * Handles true/false/"mixed" states.
 * @class TristateType
 * @extends StateType
 */
export default class TristateType extends StateType {

    /**
     * @inheritDoc
     */
    coerce(value) {

        return (
            (/^mixed$/i).test(value)
            ? "mixed"
            : super.coerce(value)
        );

    }

    /**
     * @inheritDoc
     */
    read() {

        return (
            this.value === "mixed"
            ? "mixed"
            : super.read()
        );

    }

}
