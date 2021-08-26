describe("Utilities", function () {

    var PROPERTY = "label";
    var ATTRIBUTE = "aria-" + PROPERTY;

    describe("Aria.VERSION", function () {

        it("should exist", function () {
            chai.assert.property(Aria, "VERSION");
        });

        it("should be a semver value", function () {

            // Semantic Versioning 2.0.0
            // Taken on 22nd August 2021.
            // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
            var regexp = (/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/);

            chai.assert.isString(Aria.VERSION);
            chai.assert.isTrue(regexp.test(Aria.VERSION));

        });

        it("should not be possible to change the value", function () {

            var version = Aria.VERSION;
            var random = randomString();

            Aria.VERSION = random;
            chai.assert.notStrictEqual(Aria.VERSION, random);
            chai.assert.strictEqual(Aria.VERSION, version);

        });

    });

    describe("Aria.prefix", function () {

        it("should add the \"aria-\" prefix", function () {
            chai.assert.strictEqual(Aria.prefix(PROPERTY), ATTRIBUTE);
        });

        it("should not affect an attribute already starting with \"aria-\"", function () {
            chai.assert.strictEqual(Aria.prefix(ATTRIBUTE), ATTRIBUTE);
        });

        it("should convert the value to lower-case", function () {

            var upperProperty = PROPERTY.toUpperCase();
            var upperAttribute = ATTRIBUTE.toUpperCase();

            chai.assert.notStrictEqual(PROPERTY, upperProperty);
            chai.assert.notStrictEqual(ATTRIBUTE, upperAttribute);
            chai.assert.strictEqual(Aria.prefix(upperProperty), ATTRIBUTE);
            chai.assert.strictEqual(Aria.prefix(upperAttribute), ATTRIBUTE);

        });

    });

    describe("Aria.unprefix", function () {

        it("should remove the \"aria-\" prefix", function () {
            chai.assert.strictEqual(Aria.unprefix(ATTRIBUTE), PROPERTY);
        });

        it("should not affect an attribute that doesn't start with \"aria-\"", function () {
            chai.assert.strictEqual(Aria.unprefix(PROPERTY), PROPERTY);
        });

        it("should convert the value to lower-case", function () {

            var upperProperty = PROPERTY.toUpperCase();
            var upperAttribute = ATTRIBUTE.toUpperCase();

            chai.assert.notStrictEqual(PROPERTY, upperProperty);
            chai.assert.notStrictEqual(ATTRIBUTE, upperAttribute);
            chai.assert.strictEqual(Aria.unprefix(upperProperty), PROPERTY);
            chai.assert.strictEqual(Aria.unprefix(upperAttribute), PROPERTY);

        });

    });

    describe("Aria.identify", function () {

        it("should return the ID of an element", function () {

            var id = randomString("id-");
            var div = document.createElement("div");
            div.id = id;

            chai.assert.strictEqual(Aria.identify(div), id);

        });

        it("should create an ID for an element without one", function () {

            var div = document.createElement("div");
            document.body.appendChild(div);

            chai.assert.isFalse(div.hasAttribute("id"));
            Aria.identify(div);
            chai.assert.isTrue(div.hasAttribute("id"));
            document.body.removeChild(div);

        });

        it("should create a unique ID", function () {

            var divs = [
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div")
            ];
            document.body.appendChild(divs[0]);
            document.body.appendChild(divs[1]);
            document.body.appendChild(divs[2]);
            var id = Aria.identify(divs[0]);
            var idNumber = Number(id.match(/(\d+)$/)[1]);
            var idStem = id.replace(idNumber, "");
            divs[1].id = idStem + (idNumber + 1);
            chai.assert.notStrictEqual(divs[1].id, Aria.identify(divs[2]));

            document.body.removeChild(divs[0]);
            document.body.removeChild(divs[1]);
            document.body.removeChild(divs[2]);

        });

    });

});
