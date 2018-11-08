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

    it("should be able to interpret a string, element or array", function () {

        var ids = divs.map(function (div) {
            return ARIA.identify(div);
        });

        chai.assert.deepEqual(referenceList.interpret(ids.join(" ")), ids);
        chai.assert.deepEqual(referenceList.interpret(ids), ids);
        chai.assert.deepEqual(referenceList.interpret(divs), ids);

        var mixed = ids.concat();
        mixed[0] = divs[0];
        chai.assert.deepEqual(referenceList.interpret(mixed), ids);

    });

    it("shouldn't include empty values after interpretting", function () {

        chai.assert.deepEqual(referenceList.interpret(null), []);
        chai.assert.deepEqual(referenceList.interpret(), []);
        chai.assert.deepEqual(referenceList.interpret(""), []);

    });

    it("should return an array of elements", function () {

        referenceList.set(divs);
        chai.assert.deepEqual(referenceList.get(), divs);

    });

    it("should return null for an element that can't be found", function () {

        referenceList.set(divs.concat(document.createElement("div")));
        chai.assert.isNull(referenceList.get()[divs.length]);

    });

});
