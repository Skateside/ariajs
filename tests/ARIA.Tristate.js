describe("ARIA.Tristate", function () {

    var div;
    var tristate;
    var ATTRIBUTE = "data-tristate";

    beforeEach(function () {

        div = document.createElement("div");
        tristate = new ARIA.Tristate(div, ATTRIBUTE);

    });

    it("should inherit from ARIA.State", function () {
        chai.assert.isTrue(tristate instanceof ARIA.State);
    });

    it("should consider \"mixed\" to be a valid token", function () {
        chai.assert.isTrue(tristate.isValidToken("mixed"));
    });

    it("should interpret a value as true, false or \"mixed\"", function () {

        chai.assert.isTrue(tristate.interpret(true));
        chai.assert.isTrue(tristate.interpret("true"));
        chai.assert.isFalse(tristate.interpret(false));
        chai.assert.isFalse(tristate.interpret("false"));
        chai.assert.equal(tristate.interpret("mixed"), "mixed");
        chai.assert.equal(tristate.interpret("UNRECOGNISED VALUE"), "");

    });

    it("should return true, false or undefined", function () {

        tristate.set(true);
        chai.assert.isTrue(tristate.get());
        tristate.set(false);
        chai.assert.isFalse(tristate.get());
        tristate.set("mixed");
        chai.assert.equal(tristate.get(), "mixed");
        tristate.remove();
        chai.assert.equal(tristate.get(), "");

    });

    it("should update the attribute to reflect the value", function () {

        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        tristate.set(true);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "true");
        tristate.set(false);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "false");
        tristate.set("mixed");
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "mixed");

    });

});
