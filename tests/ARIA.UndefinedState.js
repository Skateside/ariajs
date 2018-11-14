describe("ARIA.UndefinedState", function () {

    var div;
    var undefinedState;
    var ATTRIBUTE = "data-undefinedstate";

    beforeEach(function () {

        div = document.createElement("div");
        undefinedState = new ARIA.UndefinedState(div, ATTRIBUTE);

    });

    it("should inherit from ARIA.State", function () {
        chai.assert.isTrue(undefinedState instanceof ARIA.State);
    });

    it("should interpret a value as true, false or undefined", function () {

        chai.assert.isTrue(undefinedState.interpret(true));
        chai.assert.isTrue(undefinedState.interpret("true"));
        chai.assert.isFalse(undefinedState.interpret(false));
        chai.assert.isFalse(undefinedState.interpret("false"));
        chai.assert.equal(undefinedState.interpret(undefined), "undefined");
        chai.assert.equal(undefinedState.interpret("undefined"), "undefined");
        chai.assert.equal(undefinedState.interpret(), "undefined");

    });

    it("should return true, false or undefined", function () {

        undefinedState.set(true);
        chai.assert.isTrue(undefinedState.get());
        undefinedState.set(false);
        chai.assert.isFalse(undefinedState.get());
        undefinedState.set(undefined);
        chai.assert.isUndefined(undefinedState.get());

    });

    it("should update the attribute to reflect the value", function () {

        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        undefinedState.set(true);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "true");
        undefinedState.set(false);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "false");
        undefinedState.set();
        chai.assert.equal(div.getAttribute(ATTRIBUTE), "undefined");

    });

    it("should convert to a string", function () {

        undefinedState.set(true);
        chai.assert.equal(undefinedState.toString(), "true");
        undefinedState.set(false);
        chai.assert.equal(undefinedState.toString(), "false");
        undefinedState.set(undefined);
        chai.assert.equal(undefinedState.toString(), "undefined");

    });

});
