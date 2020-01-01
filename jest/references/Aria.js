import Aria from "~/references/Aria.js";
import Factory from "~/Factory.js";
import ObservableBasicType from "~/types/ObservableBasicType.js";
import Attribute from "~/attributes/Attribute.js";
import {
    randomString
} from "~j/jest-common.js";

describe("Aria", () => {

    let element;
    let aria;

    beforeEach(() => {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    test("attribute changes are heard", () => {

        let attribute = "data-" + randomString().toLowerCase();
        let fn = jest.fn();

        Factory.get().add(attribute, ObservableBasicType, Attribute);
        aria[attribute] = randomString();
        expect(fn).toHaveBeenCalled();

    });

});
