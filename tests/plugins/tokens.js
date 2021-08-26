describe("tokens", function () {

    var element;
    var aria;

    beforeEach(function () {

        element = document.createElement("div");
        aria = new Aria(element);

    });

    describe("Aria.tokens", function () {

        it("should exist", function () {
            chai.assert.property(Aria, "tokens");
        });

        it("should contain arrays of strings", function () {

            Object.keys(Aria.tokens).forEach(function (attribute) {

                chai.assert.isArray(Aria.tokens[attribute]);
                chai.assert.isTrue(Aria.tokens[attribute].every(function (item) {
                    return typeof item === "string";
                }));

            });

        });

    });

    describe("writing", function () {

        it("should allow unaffected properties to write as normal", function () {

            var property = "label";
            var attribute = "aria-" + property;
            var value = randomString();

            chai.assert.notProperty(Aria.tokens, attribute);
            aria[property] = value;
            chai.assert.strictEqual(element.getAttribute(attribute), value);

        });

        it("should prevent a wrong value being written", function () {

            var attributes = Object.keys(Aria.tokens);
            var attribute = attributes[0];
            var property = Aria.unprefix(attribute);
            var valid = Aria.tokens[attribute][0];
            var invalid = randomString(valid + "__");

            chai.assert.notInclude(Aria.tokens[attribute], invalid);
            aria[property] = invalid;
            chai.assert.isFalse(element.hasAttribute(attribute));

        });

        it("should console.warn() if an invalid value is written", function () {

            var isWarned = false;
            var warnBackup = randomString("_warn_");
            console[warnBackup] = console.warn;
            console.warn = function () {
                isWarned = true;
            };

            var attributes = Object.keys(Aria.tokens);
            var attribute = attributes[0];
            var property = Aria.unprefix(attribute);
            var valid = Aria.tokens[attribute][0];
            var invalid = randomString(valid + "__");

            chai.assert.notInclude(Aria.tokens[attribute], invalid);
            aria[property] = invalid;
            chai.assert.isTrue(isWarned);

            console.warn = console[warnBackup];
            delete console[warnBackup];

        });

        it("should allow items in a list to be written", function () {

            var property = "role";
            var attribute = property;
            var valid = Aria.tokens[attribute][0];

            chai.assert.isFalse(element.hasAttribute(attribute));
            aria[property] = valid;
            chai.assert.isTrue(element.hasAttribute(attribute));
            chai.assert.strictEqual(element.getAttribute(attribute), valid);

        });

        it("should only allow valid items in a list to be written", function () {

            var property = "role";
            var attribute = property;
            var valid = Aria.tokens[attribute][0];
            var invalid = randomString(valid + "_");

            chai.assert.notInclude(Aria.tokens[attribute], invalid);
            aria[property] = valid;
            chai.assert.isTrue(element.hasAttribute(attribute));
            chai.assert.strictEqual(element.getAttribute(attribute), valid);
            aria[property] = [valid, invalid];
            chai.assert.strictEqual(element.getAttribute(attribute), valid);

        });

        it("should console.warn() if an invalid value is written in a list", function () {

            var isWarned = false;
            var warnBackup = randomString("_warn_");
            console[warnBackup] = console.warn;
            console.warn = function () {
                isWarned = true;
            };

            var property = "role";
            var attribute = property;
            var valid = Aria.tokens[attribute][0];
            var invalid = randomString(valid + "_");

            chai.assert.notInclude(Aria.tokens[attribute], invalid);
            aria[property] = [valid, invalid];
            chai.assert.isTrue(isWarned);

            console.warn = console[warnBackup];
            delete console[warnBackup];

        });

        it("should allow a boolean to be written", function () {

            var property = "current";
            var attribute = "aria-" + property;

            chai.assert.property(Aria.tokens, attribute);
            chai.assert.isFalse(element.hasAttribute(attribute));
            aria[property] = true;
            chai.assert.isTrue(aria[property]);
            chai.assert.strictEqual(element.getAttribute(attribute), "true");
            aria[property] = "false";
            chai.assert.isFalse(aria[property]);
            chai.assert.strictEqual(element.getAttribute(attribute), "false");

        });

    });

    describe("tokenState type", function () {

        var PROPERTY = "current";
        var ATTRIBUTE = "aria-" + PROPERTY;

        it("should allow a string to be written", function () {

            var valid = Aria.tokens[ATTRIBUTE];
            var value = valid[valid.length - 1];

            aria[PROPERTY] = value;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);

        });

        it("should allow a boolean to be written", function () {

            chai.assert.notStrictEqual(element.getAttribute(ATTRIBUTE), "true");
            aria[PROPERTY] = true;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "true");

        });

        it("should return a boolean", function () {

            aria[PROPERTY] = true;
            chai.assert.isTrue(aria[PROPERTY]);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "true");

        });

        it("should return a boolean if the string equivalent is set", function () {

            aria[PROPERTY] = "true";
            chai.assert.isTrue(aria[PROPERTY]);
            aria[PROPERTY] = "false";
            chai.assert.isFalse(aria[PROPERTY]);

        });

        it("should return false if the attribute isn't set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.isFalse(aria[PROPERTY]);

        });

        it("should return false if the value is set to something invalid", function () {

            var tokens = Aria.tokens[ATTRIBUTE];
            var invalid = randomString("invalid_");

            chai.assert.notInclude(tokens, invalid);
            element.setAttribute(ATTRIBUTE, invalid);
            chai.assert.isFalse(aria[PROPERTY]);

        });

    });

    describe("tokenUndefined type", function () {

        var PROPERTY = "orientation";
        var ATTRIBUTE = "aria-" + PROPERTY;

        it("should allow a string to be written", function () {

            var valid = Aria.tokens[ATTRIBUTE];
            var value = valid[valid.length - 1];

            aria[PROPERTY] = value;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);

        });

        it("should allow undefined to be written", function () {

            chai.assert.notStrictEqual(element.getAttribute(ATTRIBUTE), "undefined");
            aria[PROPERTY] = undefined;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "undefined");

        });

        it("should allow undefined to be returned", function () {

            aria[PROPERTY] = undefined;
            chai.assert.isUndefined(aria[PROPERTY]);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "undefined");

        });

        it("should return undefined if \"undefined\" is set", function () {

            aria[PROPERTY] = "undefined";
            chai.assert.isUndefined(aria[PROPERTY]);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), "undefined");

        });

        it("should returned undefined if the value isn't set", function () {

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            chai.assert.isUndefined(aria[PROPERTY]);

        });

        it("should return undefined if the value is set to something invalid", function () {

            var tokens = Aria.tokens[ATTRIBUTE];
            var invalid = randomString("invalid_");

            chai.assert.notInclude(tokens, invalid);
            element.setAttribute(ATTRIBUTE, invalid);
            chai.assert.isUndefined(aria[PROPERTY]);

        });

    });

});
