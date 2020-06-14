describe("listType", function () {

    var element;
    var aria;
    var PROPERTY = "dropeffect";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("writing", function () {

        it("should be able to write a string", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.equal(element.getAttribute(ATTRIBUTE), value);

        });

        it("should be able to write an array", function () {

            var values = [
                randomString(),
                randomString(),
                randomString()
            ];

            aria[PROPERTY] = values;
            chai.assert.equal(element.getAttribute(ATTRIBUTE), values.join(" "));

        });

        it("should be able to write an array-like object", function () {

            var valuesArray = [
                randomString(),
                randomString(),
                randomString()
            ];
            var valuesObject = valuesArray.reduce(function (object, item, i) {

                object[i] = item;
                return object;

            }, {});

            valuesObject.length = valuesArray.length;
            aria[PROPERTY] = valuesObject;
            chai.assert.equal(element.getAttribute(ATTRIBUTE), valuesArray.join(" "));

        });

    });

    describe("reading", function () {

        it("should read a value as an array", function () {

            var value = randomString();

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.sameOrderedMembers(aria[PROPERTY], [value]);

        });

        it("should split the value by spaces", function () {

            var values = [
                randomString(),
                randomString(),
                randomString()
            ];

            element.setAttribute(ATTRIBUTE, values.join(" "));
            chai.assert.sameOrderedMembers(aria[PROPERTY], values);

        });

        it("should trim the attribute", function () {

            var value = [
                " ".repeat(randomInteger(10) + 1),
                randomString(),
                " ".repeat(randomInteger(10) + 1)
            ].join(" ");

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.sameOrderedMembers(aria[PROPERTY], [value.trim()]);

        });

        it("should remove larges spaces between values", function () {

            var values = [
                randomString(),
                randomString(),
                randomString()
            ];
            var valuesString = values.reduce(function (string, item) {
                return string + " ".repeat(randomInteger(10) + 2) + item;
            }, "");

            element.setAttribute(ATTRIBUTE, valuesString);
            chai.assert.sameOrderedMembers(aria[PROPERTY], values);

        });

        it("should return an empty array if the attribute is not set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.isTrue(Array.isArray(aria[PROPERTY]));
            chai.assert.sameOrderedMembers(aria[PROPERTY], []);

        });

    });

    describe("deleting", function () {

        it("should remove the attribute if set to an empty string", function () {

            element.setAttribute(ATTRIBUTE, randomString());
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            aria[PROPERTY] = "";
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should remove the attribute if set to an empty array", function () {

            element.setAttribute(ATTRIBUTE, randomString());
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            aria[PROPERTY] = [];
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

    });

});
