describe("aria.digitalPublishing", function () {

    describe("ARIA.Element#role", function () {

        it("should consider digital publishing roles to be valid", function () {

            var div = document.createElement("div");
            var element = new ARIA.Element(div);
            var value = "doc-abstract";

            element.role = value;
            chai.assert.isTrue(div.hasAttribute("role"));
            chai.assert.deepEqual(element.role, [value]);

        });

    });

});
