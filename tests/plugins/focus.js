describe("aria.focus", function () {

    describe("ARIA.is", function () {

        it("should be able to check an element against a selector", function () {

            var nodeName = "div";
            var element = document.createElement(nodeName);
            var className = "class-" + makeUniqueId();

            element.className = className;

            document.body.appendChild(element);
            chai.assert.isTrue(ARIA.is(element, nodeName));
            chai.assert.isTrue(ARIA.is(element, "." + className));
            document.body.removeChild(element);

        });

    });

    describe("ARIA.isFocusable", function () {

        it("should return true for naturally focusable elements", function () {

            var button = document.createElement("button");
            var div = document.createElement("div");

            document.body.appendChild(button);
            document.body.appendChild(div);
            chai.assert.isTrue(ARIA.isFocusable(button));
            chai.assert.isFalse(ARIA.isFocusable(div));
            document.body.removeChild(button);
            document.body.removeChild(div);

        });

    });

});
