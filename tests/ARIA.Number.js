describe("ARIA.Number", function () {

    var div;
    var number;

    beforeEach(function () {

        div = document.createElement("div");
        number = new ARIA.Number(div, "data-number");

    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(number instanceof ARIA.Property);
    });

    it("should already have a pattern set", function () {
        chai.assert.isTrue(number.pattern instanceof RegExp);
    });

    it("should interpret values as numbers", function () {

        var values = [10, "10"];

        chai.assert.equal(number.interpret(values[0]), values[0]);
        chai.assert.equal(number.interpret(values[1]), values[0]);

    });

    it("should keep decimals", function () {

        var value = 10.6;

        chai.assert.equal(number.interpret(value), value);

    });

    it("should allow integers and decimals", function () {

        var values = [10, 10.1, 0.1, .1];

        values.forEach(function (value) {
            chai.assert.equal(number.interpret(value), value);
        });

    });

    it("should return NaN if the value cannot be interpretted as a number", function () {

        chai.assert.isNaN(number.interpret());
        chai.assert.isNaN(number.interpret(undefined));
        chai.assert.isNaN(number.interpret(null));
        chai.assert.isNaN(number.interpret(""));
        chai.assert.isNaN(number.interpret("apple"));

    });

    it("should return a number from get()", function () {

        var value = "10";

        number.set(value);
        chai.assert.equal(number.get(), parseInt(value, 10));
        chai.assert.isNumber(number.get());

    });

});
