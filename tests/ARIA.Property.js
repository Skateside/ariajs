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

    it("should trigger preset and postset events", function () {

        var hasPresetFired = false;
        var hasPostsetFired = false;

        ARIA.on(ARIA.EVENT_PRE_SET, function () {
            hasPresetFired = true;
        });
        ARIA.on(ARIA.EVENT_POST_SET, function () {
            hasPostsetFired = true;
        });
        property.set(makeUniqueId());

        chai.assert.isTrue(hasPresetFired);
        chai.assert.isTrue(hasPostsetFired);

    });

    it("should prevent setting if the preset default is prevented", function () {

        var value = makeUniqueId();

        ARIA.on(ARIA.EVENT_PRE_SET, function (e) {

            if (e.detail.raw === value) {
                e.preventDefault();
            }

        });

        property.set(value);
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should allow an attribute to be retrieved", function () {

        var value = "abc123";

        property.set(value);
        chai.assert.equal(div.getAttribute(ATTRIBUTE), value);
        chai.assert.equal(property.get(), value);

    });

    it("should trigger preset and postget events", function () {

        var hasPregetFired = false;
        var hasPostgetFired = false;

        ARIA.on(ARIA.EVENT_PRE_GET, function () {
            hasPregetFired = true;
        });
        ARIA.on(ARIA.EVENT_POST_GET, function () {
            hasPostgetFired = true;
        });
        property.set(makeUniqueId());
        property.get();

        chai.assert.isTrue(hasPregetFired);
        chai.assert.isTrue(hasPostgetFired);

    });

    it("should passed details to the events", function () {

        var eElement;
        var eAttribute;
        var eRaw;
        var eValue;
        var value = makeUniqueId();

        ARIA.on(ARIA.EVENT_PRE_SET, function (e) {

            eElement = e.detail.element;
            eAttribute = e.detail.attribute;
            eRaw = e.detail.raw;
            eValue = e.detail.value;

        });

        property.set(value);
        chai.assert.equal(eElement, div);
        chai.assert.equal(eAttribute, ATTRIBUTE);
        chai.assert.equal(eRaw, value);
        chai.assert.equal(eValue, value);

    });

    it("should prevent getting if the preget default is prevented", function () {

        var hasPrevented = false;

        ARIA.on(ARIA.EVENT_PRE_GET, function (e) {

            if (!hasPrevented) {

                hasPrevented = true;
                e.preventDefault();

            }

        });

        property.set(makeUniqueId());
        chai.assert.isUndefined(property.get());

    });

    it("should remove an attribute when setting it to an empty string", function () {

        property.set("abc123");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        property.set("");
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should trigger preremove and postremove events", function () {

        var hasPreremoveFired = false;
        var hasPostremoveFired = false;

        ARIA.on(ARIA.EVENT_PRE_REMOVE, function () {
            hasPreremoveFired = true;
        });
        ARIA.on(ARIA.EVENT_POST_REMOVE, function () {
            hasPostremoveFired = true;
        });

        property.remove();
        chai.assert.isTrue(hasPreremoveFired);
        chai.assert.isTrue(hasPostremoveFired);

        // Make sure that set("") also activates remove()
        hasPreremoveFired = false;
        hasPostremoveFired = false;
        property.set("");
        chai.assert.isTrue(hasPreremoveFired);
        chai.assert.isTrue(hasPostremoveFired);

    });

    it("should not remove if preremove default is prevented", function () {

        var value = makeUniqueId();
        var hasPrevented = false;

        ARIA.on(ARIA.EVENT_PRE_REMOVE, function (e) {

            if (!hasPrevented) {

                hasPrevented = true;
                e.preventDefault();

            }

        });

        property.set(value);
        chai.assert.equal(property.get(), value);
        property.remove();
        chai.assert.equal(property.get(), value);

        hasPrevented = false;
        property.set("");
        chai.assert.equal(property.get(), value);

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

    it("should return null if the attribute is not set", function () {

        div.removeAttribute(ATTRIBUTE);
        chai.assert.isNull(property.get());

    });

});
