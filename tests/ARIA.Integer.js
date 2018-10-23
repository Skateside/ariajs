describe("ARIA.Integer", function () {

    var div;
    var integer;

    beforeEach(function () {

        div = document.createElement("div");
        integer = new ARIA.Integer(div, "data-integer");

    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(integer instanceof ARIA.Property);
    });

    it("should already have a pattern set", function () {
        chai.assert.isTrue(integer.pattern instanceof RegExp);
    });

    it("should interpret values as integers", function () {

        var values = [10, "10"];

        chai.assert.equal(integer.interpret(values[0]), values[0]);
        chai.assert.equal(integer.interpret(values[1]), values[0]);

    });

    it("should discard decimals", function () {

        var value = 10.6;

        chai.assert.equal(integer.interpret(value), Math.floor(value));

    });

    it("should return NaN if the value cannot be interpretted as a number", function () {

        chai.assert.isNaN(integer.interpret());
        chai.assert.isNaN(integer.interpret(undefined));
        chai.assert.isNaN(integer.interpret(null));
        chai.assert.isNaN(integer.interpret(""));
        chai.assert.isNaN(integer.interpret("apple"));

    });

    it("should return a number from get()", function () {

        var value = "10";

        integer.set(value);
        chai.assert.equal(integer.get(), parseInt(value, 10));
        chai.assert.isNumber(integer.get());

    });

});
