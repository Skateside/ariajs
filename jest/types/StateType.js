import StateType from "~/types/StateType.js";
import {
    randomString,
    randomNumber
} from "~j/jest-common.js";

describe("StateType", () => {

    let state;

    beforeEach(() => {
        state = new StateType();
    });

    // https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#propcharacteristic_value
    test("Starting value is false", () => {
        expect(state.read()).toBe(false);
    });

    test("true is interpretted as true", () => {

        state.write(true);
        expect(state.read()).toBe(true);

    });

    test("Any version of \"true\" is interpretted as true", () => {

        state.write("true");
        expect(state.read()).toBe(true);
        state.write("TRUE");
        expect(state.read()).toBe(true);
        state.write("tRuE");
        expect(state.read()).toBe(true);

    });

    test("Any other value is interpretted as false", () => {

        state.write(null);
        expect(state.read()).toBe(false);
        state.write(undefined);
        expect(state.read()).toBe(false);
        state.write(randomString());
        expect(state.read()).toBe(false);
        state.write(randomNumber());
        expect(state.read()).toBe(false);
        state.write([]);
        expect(state.read()).toBe(false);
        state.write({});
        expect(state.read()).toBe(false);
        state.write(() => {});
        expect(state.read()).toBe(false);

    });

});
