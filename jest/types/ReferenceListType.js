import Reference from "~/references/Reference.js";
import ReferenceListType from "~/types/ReferenceListType.js";
import {
    randomString
} from "~j/jest-common.js";

describe("ReferenceListType", () => {

    let referenceList;

    beforeEach(() => {
        referenceList = new ReferenceListType();
    });

    test("contains() checks for ID, element or Reference instance", () => {

        let reference = Reference.interpret(document.createElement("div"));

        document.body.appendChild(reference.element());
        referenceList.add(reference);

        expect(referenceList.contains(reference)).toBe(true);
        expect(referenceList.contains(reference.element())).toBe(true);
        expect(referenceList.contains(reference.identify())).toBe(true);

        document.body.removeChild(reference.element());

    });

    test("add() understands IDs, elements and Reference instances", () => {

        let references = [
            Reference.interpret(document.createElement("div")),
            Reference.interpret(document.createElement("div")),
            Reference.interpret(document.createElement("div"))
        ];

        references.forEach(
            (reference) => document.body.appendChild(reference.element())
        );
        referenceList.add(
            references[0],
            references[1].element(),
            references[2].identify()
        );
        expect(referenceList.size()).toBe(3);
        references.forEach(
            (reference) => document.body.removeChild(reference.element())
        );

    });

    test("remove() understands IDs, elements and Reference instances", () => {

        let references = [
            Reference.interpret(document.createElement("div")),
            Reference.interpret(document.createElement("div")),
            Reference.interpret(document.createElement("div"))
        ];

        references.forEach(
            (reference) => document.body.appendChild(reference.element())
        );
        expect(referenceList.size()).toBe(0);
        referenceList.add(
            references[0],
            references[1].element(),
            references[2].identify()
        );
        expect(referenceList.size()).toBe(3);

        referenceList.remove(references[2]);
        expect(referenceList.size()).toBe(2);

        referenceList.remove(references[1].identify());
        expect(referenceList.size()).toBe(1);

        referenceList.remove(references[0].element());
        expect(referenceList.size()).toBe(0);

        references.forEach(
            (reference) => document.body.removeChild(reference.element())
        );

    });

    test("toggle() can understand IDs, elements and Reference instances", () => {

        let element = document.createElement("div");
        let string = randomString();
        let reference = Reference.interpret(element);

        element.id = string;
        document.body.appendChild(element);

        expect(referenceList.size()).toBe(0);

        referenceList.toggle(element);
        expect(referenceList.size()).toBe(1);

        referenceList.toggle(string);
        expect(referenceList.size()).toBe(0);

        referenceList.toggle(reference);
        expect(referenceList.size()).toBe(1);

        document.body.removeChild(element);

    });

    test("item() will return the element or null", () => {

        let reference = Reference.interpret(document.createElement("div"));

        referenceList.add(reference);
        expect(referenceList.item(0)).toBe(reference.element());
        expect(referenceList.item(1)).toBe(null);

    });

});
