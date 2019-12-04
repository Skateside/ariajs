import IntegerType from "~/types/IntegerType.js";
import {
    randomInteger
} from "~j/jest-common.js";

describe("IntegerType", () => {

    let integerType;

    beforeEach(() => {
        integerType = new IntegerType();
    });

    test("floats will lose their decimal but not be rounded", () => {

        let int = randomInteger();
        let roundable = int + 0.9;

        integerType.write(roundable);
        expect(integerType.read()).toBe(int);

    });

});
