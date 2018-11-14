describe("aria.flowfrom", function () {

    var div;
    var ref;
    var element;

    beforeEach(function () {

        div = document.createElement("div");
        ref = document.createElement("div");
        element = new ARIA.Element(div);

        document.body.appendChild(div);
        document.body.appendChild(ref);        

    });

    afterEach(function () {

        document.body.removeChild(div);
        document.body.removeChild(ref);

    });

    it("should add support for the x-ms-aria-flowfrom attribute", function () {

        element.flowfrom = ref;
        chai.assert.isTrue(div.hasAttribute("x-ms-aria-flowfrom"));
        chai.assert.isTrue(ref.hasAttribute("id"));
        chai.assert.equal(div.getAttribute("x-ms-aria-flowfrom"), ref.id);

    });

});
