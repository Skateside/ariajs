import BasicType from "./BasicType.js";

export default class StateType extends BasicType {

    constructor() {
        super(false);
    }

    coerce(value) {
        return String(value).toLowerCase() === "true";
    }

    write(value) {
        super.write(this.coerce(value));
    }

}
