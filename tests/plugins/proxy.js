describe("proxy", function () {

    var element;
    var aria;
    var PROPERTY = "label";
    var ATTRIBUTE = "aria-" + PROPERTY;

    if (!window.Proxy) {

        it("can't exist because the environment doesn't have Proxy", function () {
            return;
        });

        return;

    }

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should be able to write the property", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

        it("should ignore an \"aria-\" prefix", function () {

            var value = randomString();

            aria[ATTRIBUTE] = value;
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

    });

    describe("reading", function () {

        it("should be able to read the property", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.strictEqual(aria[PROPERTY], value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);

        });

        it("should ignore an \"aria-\" prefix", function () {

            var value = randomString();

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);
            chai.assert.strictEqual(aria[ATTRIBUTE], value);

        });

    });

    describe("deleting", function () {

        it("should delete the attribute if the value is \"\"", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            element.setAttribute(ATTRIBUTE, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            aria[PROPERTY] = "";
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should delete the attribute if the value is \"\", ignoring an \"aria-\" prefix", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            element.setAttribute(ATTRIBUTE, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            aria[ATTRIBUTE] = "";
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should delete the attribute if the property is deleted", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            element.setAttribute(ATTRIBUTE, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            delete aria[PROPERTY];
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should delete the attribute if the property is deleted, ignoring an \"aria-\" prefix", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            element.setAttribute(ATTRIBUTE, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            delete aria[PROPERTY];
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

    });

});
