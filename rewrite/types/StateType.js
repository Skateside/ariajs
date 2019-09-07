import BasicType from "./BasicType.js";

export default class StateType extends BasicType {

    coerce(value) {

        if (value !== this.constructor.EMPTY_VALUE) {
            value = String(value).toLowerCase() === "true";
        }

        return value;

    }

    write(value) {
        return super.write(this.coerce(value));
    }

}
