describe("Element", function () {

    var div;

    beforeEach(function () {
        div = document.createElement("div");
    });

    describe("#aria", function () {

        it("should be an instance of ARIA.Element", function () {
            chai.assert.isTrue(div.aria instanceof ARIA.Element);
        });

        it("should allow interactions with WAI-ARIA attributes", function () {

            var label = makeUniqueId();

            div.aria.label = label;
            chai.assert.equal(div.getAttribute("aria-label"), label);
            chai.assert.equal(div.aria.label, label);

        });

        it("should pre-load values", function () {

            var label = makeUniqueId();

            div.setAttribute("aria-label", label);
            chai.assert.equal(div.aria.label, label);

        });

    });

});
