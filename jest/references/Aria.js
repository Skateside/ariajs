import Aria from "~/references/Aria.js";
import Factory from "~/Factory.js";
import Observer from "~/Observer.js";
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

    /*
    test("attribute changes are heard", () => {

// NOTE: This seems to need some setting up. jest.fn() isn't being called even
// though I think it should be. More work is clearly needed.

        let attribute = "data-" + randomString().toLowerCase();
        let fn = jest.fn();
        let factory = Factory.get();

        if (!factory.observer) {
            factory.setObserver(new Observer());
        }

        factory.add(attribute, ObservableBasicType, Attribute);
        aria[attribute] = randomString();
        expect(fn).toHaveBeenCalled();

    });
    */

});
