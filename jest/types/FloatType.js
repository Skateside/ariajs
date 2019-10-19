import FloatType from "../../rewrite/types/FloatType.js";
import {
    randomString,
    randomNumber
} from "../jest-common.js";

describe("FloatType", () => {

    let floatType;

    beforeEach(() => {
        floatType = new FloatType();
    });

    test("writing a number will work", () => {

        let number = randomNumber();

        floatType.write(number);
        expect(floatType.read()).toBe(number);

    });

    test("writing a numeric string will work", () => {

        let numericString = String(randomNumber());

        floatType.write(numericString);
        expect(floatType.read()).toBe(Number(numericString));

    });

    test("writing a non-numeric string will not work", () => {

        let string = randomString();

        floatType.write(string);
        expect(floatType.read()).toBe(FloatType.EMPTY_VALUE);

    });

});
