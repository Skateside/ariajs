import ObservableBasicType from "./ObservableBasicType.js";

export default class StateType extends ObservableBasicType {

    coerce(value) {

        if (value === this.constructor.EMPTY_VALUE) {
            return false;
        }

        return (/^true$/i).test(this.constructor.stringify(value));

    }

    write(value) {
        return super.write(this.coerce(value));
    }

    read() {
        return Boolean(this.value);
    }

}
