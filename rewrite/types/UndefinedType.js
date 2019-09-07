import StateType from "./StateType.js";

export default class UndefinedType extends StateType {

    coerce(value) {

        return (
            (value === undefined || value === "undefined")
            ? "undefined"
            : super.coerce(value)
        );

    }

}
