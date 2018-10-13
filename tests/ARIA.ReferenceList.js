describe("ARIA.ReferenceList", function () {

    // var ARIA = window.ARIA;
    var div;
    var divs;
    var referenceList;
    var ATTRIBUTE = "data-referencelist";

    beforeEach(function () {

        div = document.createElement("div");
        divs = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
        referenceList = new ARIA.ReferenceList(div, ATTRIBUTE);
        divs.forEach(function (otherDiv) {
            document.body.appendChild(otherDiv);
        });

    });

    afterEach(function () {

        divs.forEach(function (otherDiv) {

            if (document.body.contains(otherDiv)) {
                document.body.removeChild(otherDiv);
            }

        });

    });

    it("should inherit from ARIA.List", function () {
        chai.assert.isTrue(referenceList instanceof ARIA.List);
    });

    it("should interpret as an array of strings", function () {

        var interpretted = referenceList.interpret(divs);

        chai.assert.isTrue(interpretted.every(function (id) {
            return typeof id === "string";
        }));
        chai.assert.isTrue(interpretted.every(function (id, i) {
            return divs[i].id === id;
        }));
        chai.assert.deepEqual(referenceList.interpret(divs[0]), [interpretted[0]]);

    });

    it("shouldn't include empty values after interpretting", function () {

        chai.assert.deepEqual(referenceList.interpret(null), []);
        chai.assert.deepEqual(referenceList.interpret(), []);
        chai.assert.deepEqual(referenceList.interpret(""), []);

    });

    it("should return true only if all elements exist", function () {

        referenceList.set(divs);
        chai.assert.isTrue(referenceList.has());
        document.body.removeChild(divs[0]);
        chai.assert.isFalse(referenceList.has());

    });

    it("should be able to check for an element or ID", function () {

        referenceList.set(divs);
        chai.assert.isTrue(divs.every(function (otherDiv) {
            return referenceList.has(otherDiv);
        }));
        chai.assert.isTrue(divs.every(function (otherDiv) {
            return referenceList.has(otherDiv.id);
        }));

    });

    it("should return an array of elements", function () {

        referenceList.set(divs);
        chai.assert.deepEqual(referenceList.get(), divs);

    });

    it("should return null for an element that can't be found", function () {

        referenceList.set(divs);
        referenceList.add(document.createElement("div"));
        chai.assert.isNull(referenceList.get()[divs.length]);

    });

    it("should be able to remove an element", function () {

        referenceList.set(divs);
        referenceList.remove(divs[0]);
        chai.assert.isTrue(referenceList.hasAttribute());
        chai.assert.deepEqual(referenceList.get(), divs.slice(1));

    });

    it("should be able to see if the list contains an element", function () {

        referenceList.set(divs);
        chai.assert.isTrue(divs.every(function (otherDiv) {
            return referenceList.contains(otherDiv);
        }));

    });

    // it("should interpret strings and elements", function () {
    //
    //     var divId = makeUniqueId();
    //     div.id = divId;
    //
    //     chai.assert.equal(reference.interpret(divId), divId);
    //     chai.assert.equal(reference.interpret(div), divId);
    //     chai.assert.equal(reference.interpret(otherDiv), otherDiv.id);
    //
    // });
    //
    // it("should get the element rather than the value", function () {
    //
    //     reference.set(otherDiv);
    //     chai.assert.equal(reference.get(), otherDiv);
    //
    // });
    //
    // it("should return null if the element isn't found or set", function () {
    //
    //     chai.assert.isNull(reference.get());
    //     reference.set(makeUniqueId());
    //     chai.assert.isNull(reference.get());
    //
    // });
    //
    // it("should check to see if the element exists", function () {
    //
    //     chai.assert.isFalse(reference.has());
    //     reference.set(makeUniqueId());
    //     chai.assert.isFalse(reference.has());
    //     reference.set(otherDiv);
    //     chai.assert.isTrue(reference.has());
    //
    // });

});
