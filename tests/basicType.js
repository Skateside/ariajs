describe("basicType", function () {

    var element;
    var aria;
    var PROPERTY = "label";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should be able to write the property", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.equal(aria[PROPERTY], value);

        });

        it("should be able to write the element's attribute", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.equal(element.getAttribute(ATTRIBUTE), value);

        });

    });

});
