import StateType from "./StateType.js";

export default class TristateType extends StateType {

    coerce(value) {

        return (
            (/^mixed$/i).test(value)
            ? "mixed"
            : super.coerce(value)
        );

    }

    read() {

        return (
            this.value === "mixed"
            ? "mixed"
            : super.read()
        );

    }

}
