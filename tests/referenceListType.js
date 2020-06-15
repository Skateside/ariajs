describe("referenceListType", function () {

    var element;
    var others;
    var container;
    var aria;
    var PROPERTY = "controls";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        container = document.createElement("div");
        others = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
        aria = new Aria(element);

        others.forEach(function (other) {
            container.appendChild(other);
        });

        document.body.appendChild(element);
        document.body.appendChild(container);

    });

    afterEach(function () {

        document.body.removeChild(element);
        document.body.removeChild(container);

    });

    describe("writing", function () {

        it("should be able to add a single element", function () {

            var id = randomString("id-");

            others[0].id = id;
            aria[PROPERTY] = id;
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), id);

        });

        it("should be able to add an array of elements", function () {

            aria[PROPERTY] = others;
            var idString = others.map(function (other) {
                return other.id;
            }).join(" ");
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), idString);

        });

        it("should be able to write a NodeList", function () {

            aria[PROPERTY] = container.querySelectorAll(others[0].nodeName);
            var idString = others.map(function (other) {
                return other.id;
            }).join(" ");
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), idString);
            
        });

        it("should be able to add an array of elements and IDs", function () {

            var id = randomString("id-");
            others[1].id = id;
            aria[PROPERTY] = [
                others[0],
                others[1].id,
                others[2]
            ];
            var idString = others.map(function (other) {
                return other.id;
            }).join(" ");
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), idString);

        });

    });

    describe("reading", function () {

        it("should return an array of elements", function () {

            var id = randomString("id-");
            others[0].id = id;
            element.setAttribute(ATTRIBUTE, id);
            chai.assert.sameOrderedMembers(aria[PROPERTY], [others[0]]);

        });

        it("should return a null for every element it can't find", function () {

            element.setAttribute(ATTRIBUTE, randomString("id-"));
            chai.assert.sameOrderedMembers(aria[PROPERTY], [null]);

        });

    });

});
