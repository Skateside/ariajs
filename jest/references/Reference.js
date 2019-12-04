import Reference from "~/references/Reference.js";
import {
    randomString
} from "~j/jest-common.js";

describe("Reference", () => {

    let element;
    let reference;

    beforeEach(() => {

        element = document.createElement("div");
        reference = new Reference(element);

    });

    test("identify() returns an element's ID", () => {

        let id = randomString();
        element.id = id;

        expect(reference.identify(element)).toBe(id);

    });

    test("identify() can generate an ID", () => {

        expect(element.id).toBe("");
        expect(reference.identify()).not.toBe("");
        expect(element.id).not.toBe("");

    });

    test("Reference.generateId() can have a prefix defined", () => {

        let string = randomString();

        expect(Reference.generateId(string).startsWith(string)).toBe(true);

    });

    test("element() returns the element", () => {
        expect(reference.element()).toBe(element);
    });

    test("Reference.lookup() can find an element", () => {

        let id = randomString();
        let element = document.createElement("div");
        element.id = id;
        document.body.appendChild(element);

        expect(Reference.lookup(randomString())).toBeNull();
        expect(Reference.lookup(id)).toBe(element);

        document.body.removeChild(element);

    });

    test("References.isReference() to detect instances of Reference", () => {

        expect(Reference.isReference(reference)).toBe(true);
        expect(Reference.isReference(element)).toBe(false);

    });

    test("Reference.interpret() will create a Reference", () => {

        let id = randomString();
        let appendedElement = document.createElement("div");
        appendedElement.id = id;
        document.body.appendChild(appendedElement);

        let created = document.createElement("div");
        let fromElement = Reference.interpret(created);
        let fromString = Reference.interpret(id);
        let fromReference = Reference.interpret(reference);

        expect(Reference.isReference(fromElement)).toBe(true);
        expect(fromElement.element()).toBe(created);
        expect(Reference.isReference(fromString)).toBe(true);
        expect(fromString.element()).toBe(appendedElement);
        expect(Reference.isReference(fromReference)).toBe(true);
        expect(fromReference.element()).toBe(element);

        document.body.removeChild(appendedElement);

    });

});
