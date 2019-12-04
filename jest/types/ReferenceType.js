import ReferenceType from "~/types/ReferenceType.js";
import {
    randomString,
    randomInteger
} from "~j/jest-common.js";

describe("ReferenceType", () => {

    let referenceType;

    beforeEach(() => {
        referenceType = new ReferenceType();
    });

    test("writing an element will work", () => {

        let element = document.createElement("div");

        referenceType.write(element);
        expect(referenceType.read()).toBe(element);

    });

    test("writing a string will work", () => {

        let element = document.createElement("div");
        let id = randomString();
        element.id = id;
        document.body.appendChild(element);

        referenceType.write(id);
        expect(referenceType.read()).toBe(element);

        document.body.removeChild(element);

    });

    test("writing a string that doesn't match an ID will work but return null", () => {

        referenceType.write(randomString());
        expect(referenceType.read()).toBeNull();

    });

    test("writing something else will work, but return null", () => {

        let tests = [
            randomInteger(),
            true,
            null,
            undefined,
            {},
            []
        ];

        tests.forEach((test) => {

            let ref = new ReferenceType();
            ref.write(test);
            expect(ref.read()).toBeNull();

        });

    });

});
