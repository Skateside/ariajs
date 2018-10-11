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

    it("should throw an error when validating invalid tokens", function () {

        chai.assert.throws(function () {
            list.isValidToken("");
        });

        chai.assert.throws(function () {
            list.isValidToken(" ");
        });

    });

    it("should interpret values as an array", function () {

        chai.assert.isArray(list.interpret("one"));
        chai.assert.deepEqual(list.interpret("one"), ["one"]);
        chai.assert.deepEqual(list.interpret("one two"), ["one", "two"]);
        chai.assert.deepEqual(list.interpret(" one  two "), ["one", "two"]);
        chai.assert.deepEqual(list.interpret(""), []);
        chai.assert.deepEqual(list.interpret(), []);

    });

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

    it("should be able to check for a value in the list", function () {

        chai.assert.isFalse(list.has());
        list.set("one two");
        chai.assert.isTrue(list.has());
        chai.assert.isTrue(list.has("one"));
        chai.assert.isTrue(list.has("two"));
        chai.assert.isFalse(list.has("three"));

    });

    it("should be able to return a string of the values", function () {

        list.set("one two");
        chai.assert.equal(list.toString(), "one two");
        chai.assert.equal(String(list), "one two");
        chai.assert.equal(list.toString(","), "one,two");

    });

    it("should be able to add multiple unique values", function () {

        chai.assert.deepEqual(list.get(), []);
        list.add("one");
        chai.assert.deepEqual(list.get(), ["one"]);
        list.add("two");
        chai.assert.deepEqual(list.get(), ["one", "two"]);
        list.add("one");
        chai.assert.deepEqual(list.get(), ["one", "two"]);
        list.add("three", "four");
        chai.assert.deepEqual(list.get(), ["one", "two", "three", "four"]);

    });

    it("should be able to remove multiple values or the attribute", function () {

        list.set("one two three four");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        chai.assert.deepEqual(list.get(), ["one", "two", "three", "four"]);
        list.remove("one");
        chai.assert.deepEqual(list.get(), ["two", "three", "four"]);
        list.remove("two", "three");
        chai.assert.deepEqual(list.get(), ["four"]);
        list.remove();
        chai.assert.deepEqual(list.get(), []);
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should remove the attribute if all values are removed", function () {

        list.set("one");
        chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
        chai.assert.deepEqual(list.get(), ["one"]);
        list.remove("one");
        chai.assert.deepEqual(list.get(), []);
        chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

    });

    it("should be able to check for values within the list", function () {

        list.set("one");
        chai.assert.isTrue(list.contains("one"));
        chai.assert.isFalse(list.contains("two"));

    });

});
