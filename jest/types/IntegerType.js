import IntegerType from "../../rewrite/types/IntegerType.js";
import {
    randomInteger
} from "../jest-common.js";

describe("IntegerType", () => {

    let integerType;

    beforeEach(() => {
        integerType = new IntegerType();
    });

    test("floats will lost their decimal but not be rounded", () => {

        let int = randomInteger();
        let roundable = int + 0.9;

        integerType.write(roundable);
        expect(integerType.read()).toBe(int);

    });

});
