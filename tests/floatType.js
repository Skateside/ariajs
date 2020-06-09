describe("floatType", function () {

    var element;
    var aria;
    var PROPERTY = "valuemax";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should be able to write the property", function () {

            var value = randomNumber(10);

            aria[PROPERTY] = value;
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

        it("should be able to write the element's attribute", function () {

            var value = randomNumber(10);

            aria[PROPERTY] = value;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), String(value));

        });

        it("shouldn't write a non numberic value", function () {

            var value = randomString("abc");

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            aria[PROPERTY] = value;
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

    });

    describe("reading", function () {

        it("should coerce the value into a number", function () {

            var value = randomNumber(10);

            aria[PROPERTY] = String(value);
            chai.assert.isTrue(typeof aria[PROPERTY] === "number");
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

        it("should coerce the attribute value into a number", function () {

            var value = randomNumber(10);

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.isTrue(typeof element.getAttribute(ATTRIBUTE) === "string");
            chai.assert.isTrue(typeof aria[PROPERTY] === "number");

        });

        it("should return 0 if the attribute isn't set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.strictEqual(aria[PROPERTY], 0);

        });

        it("should read a non numeric value as 0", function () {

            var value = randomString("abc");

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);
            chai.assert.notStrictEqual(element.getAttribute(ATTRIBUTE), 0);
            chai.assert.strictEqual(aria[PROPERTY], 0);

        });

    });

});
