import FloatType from "./FloatType.js";

export default class IntegerType extends FloatType {

    write(value) {
        return super.write(Math.floor(value));
    }

}
