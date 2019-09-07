import StateType from "./StateType.js";

export default class TristateType extends StateType {

    coerce(value) {

        return (
            value === "mixed"
            ? value
            : super.coerce(value)
        );

    }

}
