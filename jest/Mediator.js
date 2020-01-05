import Mediator from "~/Mediator.js";
import BasicType from "~/types/BasicType.js";
import Attribute from "~/attributes/Attribute.js";
import Aria from "~/references/Aria.js";
import Observer from "~/Observer.js";
import {
    randomString
} from "~j/jest-common.js";

describe("Mediator", () => {

    let mediator;
    let element;
    let aria;
    let attribute;
    let attributeName = "data-" + randomString().toLowerCase();
    let type;
    let observer;

    beforeEach(() => {

        element = document.createElement("div");
        aria = new Aria(element);
        attribute = new Attribute(attributeName);
        type = new BasicType();
        observer = new Observer();
        type.setObserver(observer);
        mediator = new Mediator({
            type,
            attribute,
            reference: aria
        });

    });

    test("write() will write the attribute value", () => {

        let value = randomString();

        mediator.write(value);
        expect(type.read()).toBe(value);
        expect(attribute.read(element)).toBe(value);

    });

    test("read() will return the attribute value", () => {

        let value = randomString();

        mediator.write(value);
        expect(mediator.read()).toBe(value);

    });

    test("clear() will remove an attribute", () => {

        let value = randomString();

        mediator.write(value);
        expect(attribute.exists(element)).toBe(true);
        mediator.clear();
        expect(attribute.exists(element)).toBe(false);

    });

    test("updating type will update attribute", () => {

        let value = randomString();

        type.write(value);
        expect(attribute.read(element)).toBe(value);

    });

    test("updating attribute will update type", () => {

        let value = randomString();

        attribute.write(element, value);

        // NOTE: This is normally triggered with a MutationObserver but the
        // current environment doesn't understand it. The polyfill is
        // asynchronous and async jest is REALLY hard to make work.
        mediator.updateFromAttribute();
        expect(type.read()).toBe(value);

    });

});
