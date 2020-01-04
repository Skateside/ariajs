import BasicType from "~/types/BasicType.js";
import Observer from "~/Observer.js";
import {
    randomString,
    randomNumber
} from "~j/jest-common.js";

describe("BasicType", () => {

    let basic;
    let observer;
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
        observer = new Observer();
        basic.setObserver(observer);

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

    test("write() returns true", () => {

        expect(basic.write(BasicType.EMPTY_VALUE)).toBe(true);
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

    test("writing a value should dispatch an event", () => {

        let isFired = false;
        let type;

        observer.addEventListener(BasicType.EVENT_UPDATED, ({ detail }) => {

            isFired = true;
            type = detail.type;

        });

        basic.write(randomString());

        expect(isFired).toBe(true);
        expect(type).toBe(basic);

    });

    test("observe() should listen for changes", () => {

        let isFired = false;
        let type;

        basic.observe(({ detail }) => {

            isFired = true;
            type = detail.type;

        });

        basic.write(randomString());

        expect(isFired).toBe(true);
        expect(type).toBe(basic);

    });

    test("observe() should only listen to its own changes", () => {

        let isFired = false;
        let isOtherFired = false;
        let other = new BasicType();
        other.setObserver(observer);

        basic.observe(() => isFired = true);
        other.observe(() => isOtherFired = true);
        basic.write(randomString());

        expect(isFired).toBe(true);
        expect(isOtherFired).toBe(false);

    });

});
