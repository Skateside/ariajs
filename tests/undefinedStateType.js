describe("undefinedState type", function () {

    var element;
    var aria;
    var PROPERTY = "expanded";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should write \"undefined\" as \"undefined\"", function () {

            aria[PROPERTY] = "undefined";
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "undefined");

        });

        it("should write undefined as \"undefined\"", function () {

            aria[PROPERTY] = undefined;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "undefined");

        });

    });

    describe("reading", function () {

        it("should interpret \"undefined\" as undefined", function () {

            element.setAttribute(ATTRIBUTE, "undefined");
            chai.assert.isUndefined(aria[PROPERTY]);

        });

        it("should return undefined if the attribute is not set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.isUndefined(aria[PROPERTY]);

        });

    });

});
