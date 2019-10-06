import BasicType from "../../rewrite/types/BasicType.js";
import {
    randomString,
    randomNumber
} from "../jest-common.js";

describe("BasicType", () => {

    let basic;
    let values = [
        randomString(),
        randomNumber(),
        true,
        {}
    ];
    let empties = [
        null,
        undefined
    ];
    let allValues = [...values, ...empties];

    beforeEach(() => {
        basic = new BasicType();
    });

    test("BasicType.stringify() will create a string", () => {

        values.forEach((value) => {
            expect(BasicType.stringify(value)).toBe(String(value));
        });

        empties.forEach((empty) => {
            expect(BasicType.stringify(empty)).toBe("");
        });

    });

    test("write() to set and read() to get", () => {

        let string = randomString();

        basic.write(randomString);
        expect(basic.read()).toBe(randomString);

    });

    test("write() returns true if populated, false otherwise", () => {

        expect(basic.write(BasicType.EMPTY_VALUE)).toBe(false);
        expect(basic.write(randomString())).toBe(true);

    });

    test("write() does no transforming", () => {

        allValues.forEach((value) => {
            basic.write(value);
            expect(basic.read()).toBe(value);
        });

    });

    test("isEmpty() return true if empty, false if populated", () => {

        expect(basic.isEmpty()).toBe(true);
        basic.write(randomString());
        expect(basic.isEmpty()).toBe(false);

    });

    test("clear() will empty the value", () => {

        expect(basic.isEmpty()).toBe(true);
        basic.write(randomString());
        expect(basic.isEmpty()).toBe(false);
        basic.clear();
        expect(basic.isEmpty()).toBe(true);

    });

    test("toString() will always return a string", () => {

        allValues.forEach((value) => {
            basic.write(value);
            expect(basic.toString()).toBe(BasicType.stringify(value));
        });

    });

});
