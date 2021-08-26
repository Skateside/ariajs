describe("extend-node", function () {

    var element;
    // var aria;
    var PROPERTY = "label";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        // aria = new Aria(element);

    });

    describe("existing", function () {

        it("should add an \"aria\" property to any DOM node", function () {
            chai.assert.property(element, "aria");
        });

    });

    describe("writing", function () {

        it("should be able to write the property", function () {

            var value = randomString();

            element.aria[PROPERTY] = value;
            chai.assert.strictEqual(element.aria[PROPERTY], value);

        });

        it("should be able to write the element's attribute", function () {

            var value = randomString();

            element.aria[PROPERTY] = value;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);

        });

    });

    describe("reading", function () {

        it("should be able to read the property", function () {

            var value = randomString();

            element.aria[PROPERTY] = value;
            chai.assert.strictEqual(element.aria[PROPERTY], value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);

        });

        it("should be able to read the element's existing property", function () {

            var value = randomString();

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);
            chai.assert.strictEqual(element.aria[PROPERTY], value);

        });

        it("should return an empty string if the element doesn't have the attribute", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.strictEqual(element.aria[PROPERTY], "");

        });

    });

    describe("deleting", function () {

        it("should delete the attribute if the value is \"\"", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            element.setAttribute(ATTRIBUTE, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            element.aria[PROPERTY] = "";
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        // PhantomJS doesn't have Proxy so this test would fail on the command
        // line, even if it passes in an up-to-date browser.
        // if (window.Proxy) {
        //
        //     it("should delete the attribute if the property is deleted (requires Proxy)", function () {
        //
        //         var value = randomString();
        //
        //         chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
        //         element.setAttribute(ATTRIBUTE, value);
        //         chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
        //         delete aria[PROPERTY];
        //         chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
        //
        //     });
        //
        // }

    });

});
