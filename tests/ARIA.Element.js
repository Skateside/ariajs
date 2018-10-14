describe("ARIA.Element", function () {

    var div;
    var element;

    beforeEach(function () {

        div = document.createElement("div");
        div.id = makeUniqueId();
        element = new ARIA.Element(div);

    });

    it("should handle WAI-ARIA attributes on the element", function () {

        var label = makeUniqueId();

        element.label = label;
        chai.assert.equal(div.getAttribute("aria-label"), label);

    });

    it("should pre-load attributes that already exist", function () {

        var div = document.createElement("div");
        var div2 = document.createElement("div");
        div2.id = makeUniqueId();
        div.setAttribute("aria-controls", div2.id);
        document.body.appendChild(div2);
        var element = new ARIA.Element(div);

        chai.assert.deepEqual(element.controls.get(), [div2]);
        document.body.removeChild(div2);

    });

    it("should listen for external changes an update as necessary", function () {

        div.setAttribute("aria-dropeffect", "link");
console.log("%cdiv %o attribute value is %o; dropeffect value is %o", "background-color:#cfc", div, div.getAttribute("aria-dropeffect"), element.dropeffect && element.dropeffect.value);
        // chai.assert.equal(element.dropeffect.length, 1);
        // div.setAttribute("aria-relevant", "additions text");
        // chai.assert.equal(element.relevant.length, 1);

    });

});
