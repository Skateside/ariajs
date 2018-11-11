describe("ARIA.Number", function () {

    var div;
    var number;
    var ATTRIBUTE = "data-number";

    beforeEach(function () {

        div = document.createElement("div");
        number = new ARIA.Number(div, ATTRIBUTE);

    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(number instanceof ARIA.Property);
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

    it("should allow a minimum value to be set", function () {

        var min = rnd(10);
        var tooLow = min - 1;

        number.setMin(min);
        chai.assert.isTrue(number.isValidToken(min));
        chai.assert.isFalse(number.isValidToken(tooLow));

    });

    it("should warn if a minimum is set and the value is too low", function () {

        var warn = console.warn;
        var isWarned = false;
        console.warn = function () {
            isWarned = true;
        };

        var min = rnd(10);
        var tooLow = min - 1;

        number.setMin(min);
        number.isValidToken(tooLow);
        chai.assert.isTrue(number.isValidToken(min));

        console.warn = warn;

    });

    it("should allow a maximum value to be set", function () {

        var max = rnd(10);
        var tooHigh = max + 1;

        number.setMax(max);
        chai.assert.isTrue(number.isValidToken(max));
        chai.assert.isFalse(number.isValidToken(tooHigh));

    });

    it("should warn if a maximum is set and the value is too high", function () {

        var warn = console.warn;
        var isWarned = false;
        console.warn = function () {
            isWarned = true;
        };

        var max = rnd(10);
        var tooHigh = max + 1;

        number.setMax(max);
        number.isValidToken(tooHigh);
        chai.assert.isTrue(number.isValidToken(max));

        console.warn = warn;

    });

});
