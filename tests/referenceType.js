describe("reference type", function () {

    var element;
    var other;
    var aria;
    var PROPERTY = "activedescendant";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        other = document.createElement("div");
        aria = new Aria(element);
        document.body.appendChild(element);
        document.body.appendChild(other);

    });

    afterEach(function () {

        document.body.removeChild(element);
        document.body.removeChild(other);

    });

    describe("writing", function () {

        it("should write the element's ID when writing", function () {

            var id = randomString("id-");
            other.id = id;
            aria[PROPERTY] = other;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), id);

        });

        it("should assign an ID to an element when writing, if needed", function () {

            chai.assert.isFalse(other.hasAttribute("id"));
            aria[PROPERTY] = other;
            chai.assert.isTrue(other.hasAttribute("id"));
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), other.getAttribute("id"));

        });

    });

    describe("reading", function () {

        it("should return the element from the attribute", function () {

            var id = randomString("id-");
            other.id = id;
            element.setAttribute(ATTRIBUTE, id);
            chai.assert.strictEqual(aria[PROPERTY], other);

        });

        it("should return null if the element can't be found", function () {

            element.setAttribute(ATTRIBUTE, randomString("id-"));
            chai.assert.isNull(aria[PROPERTY]);

        });

        it("should return null if the attribute isn't set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.isNull(aria[PROPERTY]);

        });

    });

    describe("deleting", function () {

        it("should not affect the element if the attribute is deleted", function () {

            aria[PROPERTY] = other;
            chai.assert.instanceOf(aria[PROPERTY], Element);
            aria[PROPERTY] = "";
            chai.assert.isNull(aria[PROPERTY]);
            chai.assert.isTrue(document.body.contains(other));

        });

    });

});
