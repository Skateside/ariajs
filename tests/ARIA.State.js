describe("ARIA.State", function () {

    var div;
    var state;
    var ATTRIBUTE = "data-state";

    beforeEach(function () {

        div = document.createElement("div");
        state = new ARIA.State(div, ATTRIBUTE);

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

    it("should reject non boolean values", function () {

        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        state.set(1);
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        state.set("TRUE");
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        state.set("");
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        state.set(new Boolean());
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should always return a boolean", function () {

        state.set("true");
        chai.assert.isTrue(state.get());
        chai.assert.isTrue(state.value);
        state.set(true);
        chai.assert.isTrue(state.get());
        chai.assert.isTrue(state.value);

    });

});
