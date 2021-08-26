describe("integer type", function () {

    var element;
    var aria;
    var PROPERTY = "level";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should drop the decimal on any number", function () {

            var value = randomNumber(10);
            var intValue = Math.floor(value);

            aria[PROPERTY] = value;
            chai.assert.notStrictEqual(value, intValue);
            chai.assert.strictEqual(aria[PROPERTY], intValue);


        });

    });

    describe("reading", function () {

        it("should drop the decimal on any number", function () {

            var value = randomNumber(10);
            var intValue = Math.floor(value);

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.notStrictEqual(value, intValue);
            chai.assert.strictEqual(aria[PROPERTY], intValue);


        });

    });

});
