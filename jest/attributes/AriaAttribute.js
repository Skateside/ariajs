import Attribute from "../../rewrite/attributes/Attribute.js";
import AriaAttribute from "../../rewrite/attributes/AriaAttribute.js";
import {
    randomString
} from "../jest-common.js";

describe("AriaAttribute", () => {

    // let attribute;
    // let attributeName = "aria-attribute-" + randomString();
    //
    // beforeEach(() => {
    //     attribute = new AriaAttribute(attributeName);
    // });

    test("should inherit from Attribute", () => {

        let attribute = new AriaAttribute("aria-attribute-" + randomString());

        expect(attribute instanceof AriaAttribute).toBe(true);
        expect(attribute instanceof Attribute).toBe(true);

    });

    test("should throw if the attribute doesn't start with \"aria-\"", () => {

        let random = randomString();

        expect(() => new AriaAttribute("aria-" + random)).not.toThrow();
        expect(() => new AriaAttribute(random)).toThrow();

    });

    test("AriaAttribute.prefix() should prefix an attribute", () => {

        let random = randomString();

        expect(
            AriaAttribute.prefix(random).startsWith(AriaAttribute.PREFIX)
        ).toBe(true);
        expect(
            () => new AriaAttribute(AriaAttribute.prefix(random))
        ).not.toThrow();

        // Shouldn't modify an already prefixed attribute.
        let prefixed = AriaAttribute.PREFIX + random;
        expect(AriaAttribute.prefix(prefixed)).toBe(prefixed);

    });

    test("AriaAttribute.unprefix() should remove a prefix", () => {

        let random = randomString();
        let prefixed = AriaAttribute.PREFIX + random;

        expect(
            AriaAttribute.unprefix(prefixed).startsWith(AriaAttribute.PREFIX)
        ).toBe(false);

        // Shouldn't remove a prefix that doesn't exist.
        expect(AriaAttribute.unprefix(random)).toBe(random);

    });

    test("AriaAttribute.create() should cache prefixed values", () => {

        let random = randomString();
        let prefixed = AriaAttribute.PREFIX + random;

        expect(AriaAttribute.create(random)).toBe(AriaAttribute.create(prefixed));

    });

});
