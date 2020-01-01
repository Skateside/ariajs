import TristateType from "~/types/TristateType.js";

describe("TristateType", () => {

    let tristate;

    beforeEach(() => {
        tristate = new TristateType();
    });

    test("Can understand \"mixed\"", () => {

        tristate.write("mixed");
        expect(tristate.read()).toBe("mixed");
        tristate.write("MIXED");
        expect(tristate.read()).toBe("mixed");
        tristate.write("MiXeD");
        expect(tristate.read()).toBe("mixed");

    });

});
