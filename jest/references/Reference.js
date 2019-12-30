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

    test("Reference.interpret() will return the same Reference", () => {

        let element = document.createElement("div");
        let references = [
            Reference.interpret(element),
            Reference.interpret(element)
        ];

        references.forEach(
            (reference) => document.body.appendChild(reference.element())
        );

        expect(references[0]).toBe(references[1]);
        expect(
            Reference.interpret(references[0].element())
        ).toBe(references[1]);
        expect(
            Reference.interpret(references[0].identify())
        ).toBe(references[1]);

        // setTimeout is needed to prevent a NotFoundError on document.body
        // I have no idea why it's necessary, but setTimeout solves the issue.
        setTimeout(() => {
            references.forEach(
                (reference) => document.body.removeChild(reference.element())
            );
        }, 10);

    });

});
