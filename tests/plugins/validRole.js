describe("aria.validRole", function () {

    var div;
    var aria;

    beforeEach(function () {

        div = document.createElement("div");
        aria = new ARIA.Element(div);

    });

    it("should warn if an attribute is set on an element without a valid role", function () {

        var warn = console.warn;
        var isWarned = false;
        console.warn = function () {
            isWarned = true;
        };

        div.aria.checked = true; // requires role
        chai.assert.isTrue(isWarned);
        console.warn = warn;

    });

    it("should not set if failOnInvalidRole is true", function () {

        var previousValue = ARIA.failOnInvalidRole;

        ARIA.failOnInvalidRole = true;
        div.aria.checked = true; // requires role
        chai.assert.isFalse(div.hasAttribute("aria-checked"));

    });

});
