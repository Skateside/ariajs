describe("ARIA.State", function () {

    var div;
    var state;
    var ATTRIBUTE = "data-state";

    beforeEach(function () {

        div = document.createElement("div");
        state = new ARIA.State(div, ATTRIBUTE);

    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(state instanceof ARIA.Property);
    });

    it("should allow a state to be set", function () {

        state.set(true);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "true");
        state.set(false);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "false");
        state.set("true");
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "true");
        state.set("false");
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "false");

    });

    it("should always return a boolean when using the get method", function () {

        state.set("true");
        chai.assert.isTrue(state.get());
        state.set(true);
        chai.assert.isTrue(state.get());

    });

});
