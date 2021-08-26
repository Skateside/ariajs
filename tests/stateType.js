describe("state type", function () {

    var element;
    var aria;
    var PROPERTY = "atomic";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should write any truthy value as true", function () {

            [
                randomNumber(10),
                randomString(),
                [],
                {},
                true,
                1
            ].forEach(function (truthy) {

                element.removeAttribute(ATTRIBUTE);
                aria[PROPERTY] = truthy;
                chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "true");

            });

        });

        it("should write any falsy value as false", function () {

            [
                undefined,
                null,
                0,
                false
                // "" would delete the attribute
            ].forEach(function (falsy) {

                element.removeAttribute(ATTRIBUTE);
                aria[PROPERTY] = falsy;
                chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "false");

            });

        });

    });

    describe("reading", function () {

        it("should return booleans", function () {

            element.setAttribute(ATTRIBUTE, "false");
            chai.assert.isFalse(aria[PROPERTY]);
            element.setAttribute(ATTRIBUTE, "true");
            chai.assert.isTrue(aria[PROPERTY]);

        });

        it("should be case-insensitive", function () {

            element.setAttribute(ATTRIBUTE, "true");
            chai.assert.isTrue(aria[PROPERTY]);
            element.setAttribute(ATTRIBUTE, "TRUE");
            chai.assert.isTrue(aria[PROPERTY]);
            element.setAttribute(ATTRIBUTE, "TruE");
            chai.assert.isTrue(aria[PROPERTY]);

        });

        it("should interpret any non boolean attribute value as false", function () {

            element.setAttribute(ATTRIBUTE, randomNumber(10));
            chai.assert.isFalse(aria[PROPERTY]);
            element.setAttribute(ATTRIBUTE, randomString());
            chai.assert.isFalse(aria[PROPERTY]);

        });

        it("should return false if the attribute is not set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.isFalse(aria[PROPERTY]);

        });

    });

    describe("deleting", function () {

        it("should delete the attribute if set to an empty string", function () {

            element.setAttribute(ATTRIBUTE, "true");
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            aria[PROPERTY] = "";
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

    });

});
