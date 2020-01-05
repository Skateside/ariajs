import Factory from "~/Factory.js";
import BasicType from "~/types/BasicType.js";
import Attribute from "~/attributes/Attribute.js";
import Mediator from "~/Mediator.js";
import Reference from "~/references/Reference.js";
import Aria from "~/references/Aria.js";
import Observer from "~/Observer.js";
import {
    randomString,
    randomNumber
} from "~j/jest-common.js";

describe("Factory", () => {

    let factory;

    beforeEach(() => {
        factory = new Factory();
    });

    test("Factory.get() always returns the same instance", () => {
        expect(Factory.get()).toBe(Factory.get());
    });

    test("add() will throw if not given a non-empty string", () => {

        let fails = [
            "",
            randomNumber(),
            [],
            {},
            null,
            undefined
        ];

        fails.forEach((fail) => {

            expect(() => {
                factory.add(fail, BasicType, Attributes);
            }).toThrow();

        });

    });

    test("add() should throw unless overriding", () => {

        let name = randomString();

        factory.add(name, BasicType, Attribute);

        expect(() => {
            factory.add(name, BasicType, Attribute);
        }).toThrow();
        expect(() => {
            factory.add(name, BasicType, Attribute, Factory.OVERRIDE);
        }).not.toThrow();

    });

    test("recognises() should find the name", () => {

        let name = randomString();

        factory.add(name, BasicType, Attribute);

        expect(factory.recognises(name)).toBe(name);
        expect(factory.recognises(randomString(), name)).toBe(name);
        expect(factory.recognises(randomString() + name, name)).toBe(name);
        expect(factory.recognises(name, randomString())).toBe(name);
        expect(
            factory.recognises(randomString(), name, randomString())
        ).toBe(name);

    });

    test("create() will create a Mediator", () => {

        let name = randomString();

        factory.setObserver(new Observer());
        factory.add(name, BasicType, Attribute);

        let mediator = factory.create(
            name,
            new Aria(document.createElement("div"))
        );

        expect(Mediator.isMediator(mediator)).toBe(true);

    });

    test("create() will throw if the name isn't recognised", () => {

        expect(() => {
            factory.create(
                randomString(),
                new Aria(document.createElement("div"))
            );
        }).toThrow(ReferenceError);

    });

    test("create() will throw if given a Reference instead of an Aria", () => {

        let name = randomString();

        factory.setObserver(new Observer());
        factory.add(name, BasicType, Attribute);

        expect(() => {

            factory.create(
                name,
                new Reference(document.createElement("div"))
            );

        }).toThrow(TypeError);

    });

});
