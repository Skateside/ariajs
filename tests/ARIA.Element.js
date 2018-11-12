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

        chai.assert.deepEqual(element.controls, [div2]);
        document.body.removeChild(div2);

    });

    it("should listen for external changes an update as necessary", function () {

        div.setAttribute("aria-dropeffect", "link");
        chai.assert.equal(element.dropeffect.length, 1);
        div.setAttribute("aria-relevant", "additions text");
        chai.assert.equal(element.relevant.length, 2);

        var divs = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
        divs.forEach(function (div) {
            document.body.appendChild(div);
        });
        div.setAttribute("aria-controls", divs.map(function (div) {
            return ARIA.identify(div);
        }).join(" "));
        chai.assert.equal(element.controls.length, divs.length);
        divs.forEach(function (div) {
            document.body.removeChild(div);
        });

    });

    it("should be able to stop observing", function () {

        div.setAttribute("aria-relevant", "additions text");
        chai.assert.equal(element.relevant.length, 2);
        element.disconnectAttributes();
        div.setAttribute("aria-relevant", "additions");
        chai.assert.equal(div.getAttribute("aria-relevant"), "additions");
        chai.assert.equal(element.relevant.length, 2);

    });

    // I don't get it.
    // I can see this working when I try it in the browser (even IE11). Opening
    // the console on this page and playing with document.body gives me the
    // results I expect.
    // ... but for some reason, this fails every time and adding console.log()s
    // confirm it should fail.
    // I can't think of any reason why that would be the case.
    it("should be update the attribute if the property is deleted", function (done) {

        var label = makeUniqueId();
        var localDiv = document.createElement("div");
        localDiv.id = makeUniqueId();
        var localElement = new ARIA.Element(localDiv);

        localElement.label = label;
// console.log("After assign = " + stringifyElement(localDiv));
        chai.assert.isTrue(localDiv.hasAttribute("aria-label"));
        chai.assert.equal(localDiv.getAttribute("aria-label"), label);

        delete localElement.label;
// console.log("After delete = " + stringifyElement(localDiv));
        if (localDiv.hasAttribute("aria-label")) {

            window.setTimeout(function () {
// console.log("After 100 ms = " + stringifyElement(localDiv));
                if (localDiv.hasAttribute("aria-label")) {
                    done(new chai.AssertionError("Expected attribute to be removed."));
                } else {
                    done();
                }

            }, 100);

        } else {
            done();
        }

    });

});
