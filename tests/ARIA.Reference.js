describe("ARIA.Reference", function () {

    var div;
    var otherDiv;
    var reference;
    var ATTRIBUTE = "data-reference";

    beforeEach(function () {

        div = document.createElement("div");
        otherDiv = document.createElement("div");
        reference = new ARIA.Reference(div, ATTRIBUTE);
        document.body.appendChild(otherDiv);

    });

    afterEach(function () {
        document.body.removeChild(otherDiv);
    });

    it("should inherit from ARIA.Property", function () {
        chai.assert.isTrue(reference instanceof ARIA.Property);
    });

    it("should interpret strings and elements", function () {

        var divId = makeUniqueId();
        div.id = divId;

        chai.assert.equal(reference.interpret(divId), divId);
        chai.assert.equal(reference.interpret(div), divId);
        chai.assert.equal(reference.interpret(otherDiv), otherDiv.id);

    });

    it("should get the element rather than the value", function () {

        reference.set(otherDiv);
        chai.assert.equal(reference.get(), otherDiv);

    });

    it("should return null if the element isn't found or set", function () {

        chai.assert.isNull(reference.get());
        reference.set(makeUniqueId());
        chai.assert.isNull(reference.get());

    });

    it("should check to see if the element exists", function () {

        chai.assert.isFalse(reference.has());
        reference.set(makeUniqueId());
        chai.assert.isFalse(reference.has());
        reference.set(otherDiv);
        chai.assert.isTrue(reference.has());

    });

});
