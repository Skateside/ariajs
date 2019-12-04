import Attribute from "~/attributes/Attribute.js";
import {
    randomString,
    randomNumber
} from "~j/jest-common.js";

describe("Attribute", () => {

    let attribute;
    let attributeName = "attribute-" + randomString();
    let element;

    beforeEach(() => {
        attribute = new Attribute(attributeName);
        element = document.createElement("div");
    });

    test("attribute name should be validated", () => {

        expect(() => new Attribute(randomString())).not.toThrow();

        let errors = [
            randomString(5) + " " + randomString(5), // contains space
            randomNumber(), // not a string
        ];

        errors.forEach((error) => expect(() => new Attribute(error)).toThrow());

    });

    test("name() returns the attribute name (lower case)", () => {
        expect(attribute.name()).toBe(attributeName.toLowerCase());
    });

    test("Attribute.create() will cache values", () => {

        let newName = "attribute-" + randomString();

        expect(Attribute.create(newName)).toBe(Attribute.create(newName));

    });

    test("read() will read the attribute from an element", () => {

        let value = randomString();

        expect(() => attribute.read()).not.toThrow();
        expect(attribute.read()).toBeUndefined();
        expect(attribute.read(element)).toBe("");
        element.setAttribute(attributeName, value);
        expect(attribute.read(element)).toBe(value);

    });

    test("write() will set the attribute value", () => {

        let value = randomString();

        // .write() should always return true unless there's no element.
        expect(() => attribute.write()).not.toThrow();
        expect(attribute.write()).toBe(false);
        expect(attribute.write(element, value)).toBe(true);
        expect(element.getAttribute(attributeName)).toBe(value);

    });

    test("write() will coerce the value to a string", () => {

        let values = [
            randomString(),
            randomNumber(),
            {},
            []
        ];

        values.forEach((value) => {
            attribute.write(element, value);
            expect(attribute.read(element)).toBe(String(value));
        });

    });

    test("clear() will remove the attribute", () => {

        // .clear() should always return true unless there's no element.
        expect(() => attribute.clear()).not.toThrow();
        expect(attribute.clear()).toBe(false);
        expect(attribute.clear(element)).toBe(true);
        element.setAttribute(attributeName, randomString());
        expect(element.hasAttribute(attributeName)).toBe(true);
        expect(attribute.clear(element)).toBe(true);
        expect(element.hasAttribute(attributeName)).toBe(false);

    });

    test("exists() will check that the attribute exists", () => {

        expect(() => attribute.exists()).not.toThrow();
        expect(attribute.exists()).toBe(false);
        expect(attribute.exists(element)).toBe(false);
        element.setAttribute(attributeName, randomString());
        expect(attribute.exists(element)).toBe(true);

    });

    test("isEmpty() will check for an empty attribute value", () => {

        expect(() => attribute.isEmpty()).not.toThrow();
        expect(attribute.isEmpty()).toBe(true);
        expect(attribute.isEmpty(element)).toBe(true);
        element.setAttribute(attributeName, "");
        expect(attribute.isEmpty(element)).toBe(true);
        element.setAttribute(attributeName, randomString());
        expect(attribute.isEmpty(element)).toBe(false);

    });

});
