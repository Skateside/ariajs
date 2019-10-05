import ObservableBasicType from "./ObservableBasicType.js";

export default class StateType extends ObservableBasicType {

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
