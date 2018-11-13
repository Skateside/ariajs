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

    describe("#role", function () {

        it("should be pre-loaded with existing values", function () {

            var roles = ["button", "heading"];

            div.setAttribute("role", roles.join(" "));
            chai.assert.equal(div.role.length, roles.length);
            chai.assert.deepEqual(div.role, roles);

        });

        it("should reject unrecognised roles", function () {

            div.role = makeUniqueId();
            chai.assert.equal(div.role.length, 0);

        });

        it("should allow the value to be set by passing a string", function () {

            var roles = ["menuitem", "group"];
            div.role = roles.join(" ");

            chai.assert.deepEqual(div.role, roles);

        });

        it("should allow the attribute to be removed by setting an empty string", function () {

            div.setAttribute("role", "heading");
            chai.assert.equal(div.role.length, 1);
            div.role = "";
            chai.assert.isFalse(div.hasAttribute("role"));

        });

    });

});
