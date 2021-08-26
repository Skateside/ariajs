describe("tristate type", function () {

    var element;
    var aria;
    var PROPERTY = "checked";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should write \"mixed\" as \"mixed\"", function () {

            aria[PROPERTY] = "mixed";
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "mixed");

        });

    });

    describe("reading", function () {

        it("should interpret \"mixed\" as \"mixed\"", function () {

            element.setAttribute(ATTRIBUTE, "mixed");
            chai.assert.strictEqual(aria[PROPERTY], "mixed");

        });

    });

});
