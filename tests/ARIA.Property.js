describe("ARIA.Property", function () {

    var div;
    var property;
    var ATTRIBUTE = "data-property";

    beforeEach(function () {

        div = document.createElement("div");
        property = new ARIA.Property(div, ATTRIBUTE);

    });

    it("should allow an attribute to be set", function () {

        var value = "abc123";

        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        property.set(value);
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        chai.assert.equal(div.getAttribute(ATTRIBUTE), value);

    });

    it("should allow an attribute to be retrieved", function () {

        var value = "abc123";

        property.set(value);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), value);
        chai.assert.equal(property.getAttribute(), value);
        chai.assert.equal(property.get(), value);

    });

    it("should allow an attribute to be checked", function () {

        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
        chai.assert.isFalse(property.hasAttribute());
        chai.assert.isFalse(property.has());
        property.set("abc123");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        chai.assert.isTrue(property.hasAttribute());
        chai.assert.isTrue(property.has());

    });

    it("should allow an attribute to be removed", function () {

        property.set("abc123");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        property.remove();
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should remove an attribute when setting it to an empty string", function () {

        property.set("abc123");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        property.set("");
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should automatically set the value if the attribute exists", function () {

        var value = "abc123";
        var div = document.createElement("div");
        div.setAttribute(ATTRIBUTE, value);
        var property = new ARIA.Property(div, ATTRIBUTE);

        chai.assert.isTrue(property.has());

    });

    it("should interpret null and undefined as empty strings", function () {

        chai.assert.equal(property.interpret(null), "");
        chai.assert.equal(property.interpret(undefined), "");
        chai.assert.equal(property.interpret(), "");

    });

    it("should return the attribute value as a string", function () {

        var value = "abc123";

        chai.assert.equal(property.toString(), "");
        property.set(value);
        chai.assert.equal(property.toString(), value);

    });

    it("should allow tokens to be set", function () {

        var yes = "yes";
        var no = "no";

        chai.assert.isTrue(property.isValidToken(yes));
        chai.assert.isTrue(property.isValidToken(no));
        property.setTokens([yes]);
        chai.assert.isTrue(property.isValidToken(yes));
        chai.assert.isFalse(property.isValidToken(no));
        property.set(no);
        chai.assert.isFalse(property.has());
        property.set(yes);
        chai.assert.isTrue(property.has());
        chai.assert.equal(property.get(), yes);

    });

    it("should allow a pattern to be set", function () {

        var letters = "abc";
        var numbers = "123";
        var pattern = /^\d+$/;

        chai.assert.isFalse(pattern.test(letters));
        chai.assert.isTrue(pattern.test(numbers));
        chai.assert.isTrue(property.isValidToken(letters));
        chai.assert.isTrue(property.isValidToken(numbers));
        property.setPattern(pattern);
        chai.assert.isFalse(property.isValidToken(letters));
        chai.assert.isTrue(property.isValidToken(numbers));
        property.set(letters);
        chai.assert.isFalse(property.has());
        property.set(numbers);
        chai.assert.isTrue(property.has());
        chai.assert.equal(property.get(), numbers);

    });

    it("should prefer tokens to a pattern", function () {

        var letters = "abc";
        var pattern = /^\d+$/;

        property.setTokens([letters]);
        property.setPattern(pattern);
        chai.assert.isFalse(pattern.test(letters));
        chai.assert.isTrue(property.isValidToken(letters));

    });

    it("should have a value property returning the current value", function () {

        var value = "abc123";

        chai.assert.equal(property.value, "");
        property.set(value);
        chai.assert.equal(property.value, value);

    });

});
