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
        chai.assert.equal(property.get(), value);

    });

    it("should remove an attribute when setting it to an empty string", function () {

        property.set("abc123");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        property.set("");
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    // Yes, it should do this, but since we don't store the value, there's no
    // way of confirming this occured at this level.
    // it("should automatically set the value if the attribute exists", function () {
    //
    //     var value = "abc123";
    //     var div = document.createElement("div");
    //     div.setAttribute(ATTRIBUTE, value);
    //     var property = new ARIA.Property(div, ATTRIBUTE);
    //
    //     chai.assert.isTrue(property.has());
    //
    // });

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

        property = new ARIA.Property(div, ATTRIBUTE, [yes]);

        chai.assert.isTrue(property.isValidToken(yes));
        chai.assert.isFalse(property.isValidToken(no));

        property.set(yes);
        chai.assert.equal(property.get(), yes);
        property.set(no);
        chai.assert.equal(property.get(), yes);

    });

    it("should return null if the attribute is not set", function () {

        div.removeAttribute(ATTRIBUTE);
        chai.assert.isNull(property.get());

    });

});
