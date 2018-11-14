describe("aria.tokens", function () {

    describe("ARIA.Property", function () {

        var div;
        var property;
        var ATTRIBUTE = "data-property";

        beforeEach(function () {

            div = document.createElement("div");
            property = new ARIA.Property(div, ATTRIBUTE);

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

        it("should warn if invalid tokens are set", function () {

            var warn = console.warn;
            var isWarned = false;
            console.warn = function () {
                isWarned = true;
            };

            property = new ARIA.Property(div, ATTRIBUTE, [makeUniqueId()]);
            property.set(makeUniqueId());
            chai.assert.isTrue(isWarned);
            console.warn = warn;

        });

        it("should not warn if ARIA.enableWarnings is false", function () {

            var warn = console.warn;
            var isWarned = false;
            console.warn = function () {
                isWarned = true;
            };

            ARIA.enableWarnings = false;
            property = new ARIA.Property(div, ATTRIBUTE, [makeUniqueId()]);
            property.set(makeUniqueId());
            chai.assert.isFalse(isWarned);
            console.warn = warn;
            ARIA.enableWarnings = true;

        });

    });

    describe("ARIA.State", function () {

        var div;
        var state;
        var ATTRIBUTE = "data-state";

        beforeEach(function () {

            div = document.createElement("div");
            state = new ARIA.State(div, ATTRIBUTE);

        });

        it("should reject non boolean values", function () {

            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            state.set(1);
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            state.set("TRUE");
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            state.set("");
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

        });

    });

    describe("ARIA.Tristate", function () {

        var div;
        var tristate;
        var ATTRIBUTE = "data-tristate";

        beforeEach(function () {

            div = document.createElement("div");
            tristate = new ARIA.Tristate(div, ATTRIBUTE);

        });

        it("should consider \"mixed\" to be a valid token", function () {
            chai.assert.isTrue(tristate.isValidToken("mixed"));
        });

    });

    describe("ARIA.UndefinedState", function () {

        var div;
        var undefinedState;
        var ATTRIBUTE = "data-undefinedstate";

        beforeEach(function () {

            div = document.createElement("div");
            undefinedState = new ARIA.UndefinedState(div, ATTRIBUTE);

        });

        it("should consider undefined to be a valid token", function () {

            chai.assert.isTrue(undefinedState.isValidToken("undefined"));
            chai.assert.isTrue(undefinedState.isValidToken(undefined));
            chai.assert.isTrue(undefinedState.isValidToken());

        });

    });

    describe("ARIA.Element#role", function () {

        it("should allow valid roles", function () {

            var div = document.createElement("div");
            var element = new ARIA.Element(div);
            var value = "button";

            element.role = value;
            chai.assert.isTrue(div.hasAttribute("role"));
            chai.assert.deepEqual(element.role, [value]);

        });

        it("should warn on invalid roles", function () {

            var div = document.createElement("div");
            var element = new ARIA.Element(div);
            var isWarned = false;
            var warn = console.warn;

            console.warn = function () {
                isWarned = true;
            };

            element.role = makeUniqueId();
            chai.assert.isFalse(div.hasAttribute("role"));
            chai.assert.isTrue(isWarned);

            console.warn = warn;

        });

    });

});
