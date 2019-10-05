import ObservableBasicType from "./ObservableBasicType.js";

export default class FloatType extends ObservableBasicType {

    write(value) {

        let number = Number(value);

        if (Number.isNaN(number)) {

// NOTE:
// Does this correctly inherit? This should be BasicType.EMPTY_VALUE

            number = this.constructor.EMPTY_VALUE;
        }

        return super.write(number);

    }

}
