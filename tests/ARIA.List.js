describe("ARIA.List", function () {

    var div;
    var list;
    var ATTRIBUTE = "data-list";

    beforeEach(function () {

        div = document.createElement("div");
        list = new ARIA.List(div, ATTRIBUTE);

    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(list instanceof ARIA.Property);
    });

    describe("interpret", function () {

        it("should interpret values as an array", function () {

            chai.assert.isArray(list.interpret("one"));
            chai.assert.deepEqual(list.interpret("one"), ["one"]);
            chai.assert.deepEqual(list.interpret("one two"), ["one", "two"]);
            chai.assert.deepEqual(list.interpret(" one  two "), ["one", "two"]);
            chai.assert.deepEqual(list.interpret(""), []);
            chai.assert.deepEqual(list.interpret(), []);

        });

    });

    describe("get", function () {

        it("should return an array", function () {

            chai.assert.isArray(list.get());
            chai.assert.deepEqual(list.get(), []);
            list.set("one");
            chai.assert.deepEqual(list.get(), ["one"]);
            list.set("one two");
            chai.assert.deepEqual(list.get(), ["one", "two"]);

        });

        it("should remove values when using set", function () {

            list.set("one");
            chai.assert.deepEqual(list.get(), ["one"]);
            list.set("two");
            chai.assert.deepEqual(list.get(), ["two"]);

        });

        it("should be able to set by string or array", function () {

            list.set("one two");
            chai.assert.deepEqual(list.get(), ["one", "two"]);
            list.set(["three", "four"]);
            chai.assert.deepEqual(list.get(), ["three", "four"]);

        });

        it("should return an empty array if the attribute is not set", function () {

            div.removeAttribute(ATTRIBUTE);
            chai.assert.deepEqual(list.get(), []);

        });

        // This is actually a feature of ARIA.Property but there's no way of
        // testing the functionality at that level. We use this as a proxy test
        // of that functionality.
        it("should already have a list created from existing values", function () {

            var values = ["alpha", "bravo", "charlie"];

            div.setAttribute(ATTRIBUTE, values.join(" "));
            list = new ARIA.List(div, ATTRIBUTE);
            chai.assert.deepEqual(list.get(), values);

        });

    });

    describe("set", function () {

        it("should be able to set a single value", function () {

            var value = "alpha";

            list.set(value);
            chai.assert.deepEqual(list.get(), [value]);

        });

        it("should be able to set a space-separated list", function () {

            var value = "alpha bravo charlie";

            list.set(value);
            chai.assert.deepEqual(list.get(), value.split(" "));

        });

        it("should handle superfluous white-space", function () {

            var trim = " alpha bravo charlie ";
            var inner = "delta  echo  foxtrot";
            var both = " golf  hotel   indigo    ";

            function split(string) {
                return string.trim().split(/\s+/);
            }

            list.set(trim);
            chai.assert.deepEqual(list.get(), split(trim));
            list.set(inner);
            chai.assert.deepEqual(list.get(), split(inner));
            list.set(both);
            chai.assert.deepEqual(list.get(), split(both));

        });

        it("should be able to set an array", function () {

            var value = ["alpha", "bravo", "charlie"];

            list.set(value);
            chai.assert.deepEqual(list.get(), value);

        });

        it("should trim array values", function () {

            var value = [" alpha", "bravo ", " charlie "];

            list.set(value);
            chai.assert.deepEqual(list.get(), value.map(function (val) {
                return val.trim();
            }));


        });

        it("should ignore empty array values", function () {

            var value = [undefined, "alpha", "", "bravo"];

            list.set(value);
            chai.assert.deepEqual(list.get(), value.filter(Boolean));

        });

        it("should only include unique values", function () {

            var unique = ["alpha", "bravo", "charlie"];
            var dArray = unique.concat(unique);
            var dString = dArray.join(" ");

            list.set(unique);
            chai.assert.deepEqual(list.get(), unique);
            list.set(dArray);
            chai.assert.deepEqual(list.get(), unique);
            list.set(dString);
            chai.assert.deepEqual(list.get(), unique);

        });

        it("should empty the list when given an empty string or array", function () {

            list.set("test");
            chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));

            list.set("");
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            list.set("test");

            list.set("  ");
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            list.set("test");

            list.set([]);
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            list.set("test");

            list.set([""]);
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            list.set("test");

            list.set(["  "]);
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));
            list.set("test");

        });

    });

});
