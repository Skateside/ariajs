import UndefinedStateType from "~/types/UndefinedStateType.js";

describe("UndefinedStateType", () => {

    let undefinedState;

    beforeEach(() => {
        undefinedState = new UndefinedStateType();
    });

    // https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#propcharacteristic_value
    test("Starting value is undefined", () => {
        expect(undefinedState.read()).toBe(undefined);
    });

    test("\"undefined\" and undefined is understood", () => {

        undefinedState.write(undefined);
        expect(undefinedState.read()).toBe(undefined);
        undefinedState.write("undefined");
        expect(undefinedState.read()).toBe(undefined);
        undefinedState.write("UNDEFINED");
        expect(undefinedState.read()).toBe(undefined);
        undefinedState.write("UnDeFiNeD");
        expect(undefinedState.read()).toBe(undefined);

    });

});
