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
            chai.assert.equal(div.aria.label.value, label);

        });

        it("should pre-load values", function () {

            var label = makeUniqueId();

            div.setAttribute("aria-label", label);
            chai.assert.equal(div.aria.label.value, label);

        });

        it("should have placeholders for every WAI-ARIA attribute", function () {

            chai.assert.isTrue(
                Object.keys(ARIA.factories).every(function (property) {
                    return div.aria[property] instanceof ARIA.Property;
                })
            );

        });

    });

    describe("#role", function () {

        it("should be an instance of ARIA.List", function () {
            chai.assert.isTrue(div.role instanceof ARIA.List);
        });

        it("should be pre-loaded with existing values", function () {

            var roles = ["button", "heading"];

            div.setAttribute("role", roles.join(" "));
            chai.assert.equal(div.role.length, roles.length);
            chai.assert.deepEqual(div.role.get(), roles);

        });

        it("should reject unrecognised roles", function () {

            div.role.set(makeUniqueId());
            chai.assert.equal(div.role.length, 0);

        });

        it("should allow the value to be set by passing a string", function () {

            var roles = ["menuitem", "group"];
            div.role = roles.join(" ");

            chai.assert.deepEqual(div.role.get(), roles);

        });

    });

});
