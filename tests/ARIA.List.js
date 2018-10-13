describe("ARIA.List", function () {

    var div;
    var list;
    var ATTRIBUTE = "data-list";
    var isForOfSupported = false;

    // Command-line Mocha can't handle for...of but I still want to test it.
    // By using eval() I can check for syntax support and hide unrecognised
    // syntax from Mocha and other older environments. Remember to wrap all
    // for...of code in eval() inside the tests.
    try {
        eval("for (var i of []) {}");
        isForOfSupported = true;
    } catch (ignore) {
    };

    beforeEach(function () {

        div = document.createElement("div");
        list = new ARIA.List(div, ATTRIBUTE);

    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(list instanceof ARIA.Property);
    });

    describe("isValidToken", function () {

        it("should throw an error when validating invalid tokens", function () {

            chai.assert.throws(function () {
                list.isValidToken("");
            });

            chai.assert.throws(function () {
                list.isValidToken(" ");
            });

        });

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

    });

    describe("has", function () {

        it("should be able to check for a value in the list", function () {

            chai.assert.isFalse(list.has());
            list.set("one two");
            chai.assert.isTrue(list.has());
            chai.assert.isTrue(list.has("one"));
            chai.assert.isTrue(list.has("two"));
            chai.assert.isFalse(list.has("three"));

        });

    });

    describe("toString", function () {

        it("should be able to return a string of the values", function () {

            list.set("one two");
            chai.assert.equal(list.toString(), "one two");
            chai.assert.equal(String(list), "one two");
            chai.assert.equal(list.toString(","), "one,two");

        });

    });

    describe("add", function () {

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

    });

    describe("remove", function () {

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

    });

    describe("contains", function () {

        it("should be able to check for values within the list", function () {

            list.set("one");
            chai.assert.isTrue(list.contains("one"));
            chai.assert.isFalse(list.contains("two"));

        });

    });

    describe("item", function () {

        it("should be able to retrieve an item from the list", function () {

            list.set("zero one two");
            chai.assert.equal(list.item(0), "zero");
            chai.assert.equal(list.item(1), "one");
            chai.assert.equal(list.item(2), "two");

        });

        it("should be floor the value when retrieving a value", function () {

            list.set("zero one two");
            chai.assert.equal(list.item(1.1), "one");
            chai.assert.equal(list.item(1.9), "one");
            chai.assert.equal(list.item("1.1"), "one");
            chai.assert.equal(list.item("1.9"), "one");

        });

        it("should return null if there is nothing at that value", function () {

            list.set("zero one two");
            chai.assert.isNull(list.item(3));
            chai.assert.isNull(list.item(-1));

        });

    });

    describe("replace", function () {

        it("should be able to replace a value with another one", function () {

            list.set("one");
            chai.assert.isTrue(list.replace("one", "ichi"));
            chai.assert.isFalse(list.contains("one"));
            chai.assert.isTrue(list.contains("ichi"));
            // Shouldn't add a value, only replace.
            chai.assert.isFalse(list.replace("one", "ichi"));
            chai.assert.isFalse(list.contains("one"));
            chai.assert.isTrue(list.contains("ichi"));

        });

    });

    describe("forEach", function () {

        it("should be able to loop over the items", function () {

            var test = ["zero", "one", "two"];
            var items = [];
            var indicies = [];
            var arrays = [];

            list.set(test);
            list.forEach(function (item, index, array) {

                items.push(item);
                indicies.push(index);
                arrays.push(array);

            });

            chai.assert.deepEqual(items, test);
            chai.assert.deepEqual(indicies, [0, 1, 2]);
            chai.assert.deepEqual(arrays, [test, test, test]);

        });

    });

    describe("toArray", function () {

        it("should be able to be converted into an array", function () {

            var test = ["zero", "one", "two"];
            var capitalise = function (item) {
                return item.toUpperCase();
            };

            list.set(test);
            chai.assert.deepEqual(list.get(), test);
            chai.assert.deepEqual(list.toArray(), test);
            chai.assert.deepEqual(list.toArray(capitalise), list.get().map(capitalise));

        });

        it("should not change when manipulating the returned array", function () {

            var test = ["zero", "one", "two"];
            list.set(test);
            var gotten = list.get();
            var array = list.toArray();

            chai.assert.isFalse(list.contains("four"));
            gotten.push("four");
            chai.assert.isTrue(gotten.indexOf("four") > -1);
            chai.assert.isFalse(list.contains("four"));
            array.push("four");
            chai.assert.isTrue(array.indexOf("four") > -1);
            chai.assert.isFalse(list.contains("four"));

        });

    });

    describe("iterators (entries / keys / values etc.)", function () {

        it("should be able to return an entries iterator", function () {

            var test = ["zero", "one", "two"];
            list.set(test);
            var iterator = list.entries();
            var index = 0;
            var entry;

            do {

                entry = iterator.next();
                chai.assert.deepEqual(entry.value, [index, test[index]]);
                index += 1;

            } while (!entry.done);

        });

        it("should be able to return a keys iterator", function () {

            var test = ["zero", "one", "two"];
            list.set(test);
            var iterator = list.keys();
            var index = 0;
            var entry;

            do {

                entry = iterator.next();
                chai.assert.equal(entry.value, index);
                index += 1;

            } while (!entry.done);

        });

        it("should be able to return a values iterator", function () {

            var test = ["zero", "one", "two"];
            list.set(test);
            var iterator = list.values();
            var index = 0;
            var entry;

            do {

                entry = iterator.next();
                chai.assert.equal(entry.value, test[index]);
                index += 1;

            } while (!entry.done);

        });

        if (isForOfSupported) {

            it("should be iterable using for...of", function () {

                var test = ["zero", "one", "two"];
                var item;
                var index = 0;

                list.set(test);

                // see isForOfSupported note.
                eval(
                    [
                        "for (item of list) {",
                        "chai.assert.equal(item, test[index]);",
                        "index += 1;",
                        "}"
                    ].join("\n")
                );

            });

        }

    });

    describe("length", function () {

        it("should have a length property equal to the number of items in the list", function () {

            var test = ["zero", "one", "two"];

            list.set(test);
            chai.assert.equal(list.length, test.length);

        });

        it("should ignore attempts to set the length property", function () {

            var test = ["zero", "one", "two"];
            var length = test.length;

            list.set(test);
            chai.assert.doesNotThrow(function () {
                list.length = 1;
            });
            chai.assert.equal(list.length, length);

        });

    });

    describe("value", function () {

        it("should have a value property with the attribute value", function () {

            var test = "zero one two";

            list.set(test);
            chai.assert.equal(list.value, test);

        });

    });

});
