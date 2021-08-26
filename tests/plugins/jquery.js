describe("jquery", function () {

    var element;
    var jQelement;
    var aria;
    var PROPERTY = "label";
    var ATTRIBUTE = "aria-" + PROPERTY;

    beforeEach(function () {

        element = document.createElement("div");
        jQelement = $(element);
        aria = new Aria(element);

    });

    describe("existing", function () {

        it("should add an \"ariaHooks\" property to $", function () {
            chai.assert.property($, "ariaHooks");
        });

        it("should add an \"aria\" property to $.fn", function () {
            chai.assert.property($.fn, "aria");
            chai.assert.property(jQelement, "aria");
        });

        it("should add a \"role\" property to $.fn", function () {
            chai.assert.property($.fn, "role");
            chai.assert.property(jQelement, "role");
        });

        it("should add a \"removeRole\" property to $.fn", function () {
            chai.assert.property($.fn, "removeRole");
            chai.assert.property(jQelement, "removeRole");
        });

        it("should add an \"identify\" property to $.fn", function () {
            chai.assert.property($.fn, "identify");
            chai.assert.property(jQelement, "identify");
        });

    });

    describe("writing", function () {

        it("should be able to write the property", function () {

            var value = randomString();

            jQelement.aria(PROPERTY, value);
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

        it("should be able to write the element's attribute", function () {

            var value = randomString();

            jQelement.aria(PROPERTY, value);
            chai.assert.strictEqual(aria[PROPERTY], value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);

        });

        it("should be able to write with a function", function () {

            var random = randomString();
            var fullValue;

            jQelement.aria(PROPERTY, function (index, value) {

                fullValue = random + "__" + index + "__" + value;
                return fullValue;

            });

            chai.assert.strictEqual(fullValue, random + "__0__null");
            chai.assert.strictEqual(aria[PROPERTY], fullValue);


        });

        it("should be able to write with an object property", function () {

            var value = randomString();
            var object = {};
            object[PROPERTY] = value;

            jQelement.aria(object);
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

        it("should be able to write with an object method", function () {

            var random = randomString();
            var fullValue;
            var object = {};
            object[PROPERTY] = function (index, value) {

                fullValue = random + "__" + index + "__" + value;
                return fullValue;

            };

            jQelement.aria(object);
            chai.assert.strictEqual(fullValue, random + "__0__null");
            chai.assert.strictEqual(aria[PROPERTY], fullValue);

        });

        it("should ignore an \"aria-\" prefix when writing", function () {

            var value = randomString();

            jQelement.aria(ATTRIBUTE, value);
            chai.assert.strictEqual(aria[PROPERTY], value);

        });

        it("should be able to accept a jQuery object for referenceType", function () {

            var div = document.createElement("div");
            var jQdiv = $(div);
            var property = "activedescendant";

            document.body.appendChild(div);
            jQelement.aria(property, jQdiv);
            chai.assert.instanceOf(jQelement.aria(property), $);
            chai.assert.strictEqual(jQelement.aria(property)[0], div);
            document.body.removeChild(div);

        });

        it("should be able to accept a jQuery object for referenceListType", function () {

            var div = document.createElement("div");
            var jQdiv = $(div);
            var property = "controls";

            document.body.appendChild(div);
            jQelement.aria(property, jQdiv);
            chai.assert.instanceOf(jQelement.aria(property), $);
            chai.assert.strictEqual(jQelement.aria(property)[0], div);
            document.body.removeChild(div);

        });

    });

    describe("reading", function () {

        it("should be able to read the property", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.strictEqual(jQelement.aria(PROPERTY), value);

        });

        it("should be able to read the element's existing property", function () {

            var value = randomString();

            element.setAttribute(ATTRIBUTE, value);
            chai.assert.strictEqual(element.getAttribute(ATTRIBUTE), value);
            chai.assert.strictEqual(jQelement.aria(PROPERTY), value);

        });

        it("should ignore an \"aria-\" prefix when writing", function () {

            var value = randomString();

            aria[PROPERTY] = value;
            chai.assert.strictEqual(jQelement.aria(ATTRIBUTE), value);

        });

        describe("reading attributes that don't exist", function () {

            it("should return an empty string for basicType", function () {

                chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
                chai.assert.strictEqual(jQelement.aria(PROPERTY), "");

            });

            it("should return 0 for floatType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-valuemax"));
                chai.assert.strictEqual(jQelement.aria("valuemax"), 0);

            });

            it("should return 0 for integerType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-colcount"));
                chai.assert.strictEqual(jQelement.aria("colcount"), 0);

            });

            it("should return false for stateType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-atomic"));
                chai.assert.isFalse(jQelement.aria("atomic"));

            });

            it("should return false for tristateType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-checked"));
                chai.assert.isFalse(jQelement.aria("checked"));

            });

            it("should return undefined forn undefinedStateType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-expanded"));
                chai.assert.isUndefined(jQelement.aria("expanded"));

            });

            it("should return an empty jQuery object for referenceType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-activedescendant"));
                chai.assert.instanceOf(jQelement.aria("activedescendant"), $);
                chai.assert.strictEqual(jQelement.aria("activedescendant").length, 0);

            });

            it("should return an empty array for listType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-dropeffect"));
                chai.assert.isArray(jQelement.aria("dropeffect"));
                chai.assert.strictEqual(jQelement.aria("dropeffect").length, 0);

            });

            it("should return an empty jQuery object for referenceListType", function () {

                chai.assert.isFalse(element.hasAttribute("aria-controls"));
                chai.assert.instanceOf(jQelement.aria("controls"), $);
                chai.assert.strictEqual(jQelement.aria("controls").length, 0);

            });

        });

    });

    describe("deleting", function () {

        it("should delete the attribute if the value is \"\"", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(PROPERTY, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(PROPERTY, "");
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should delete the attribute if the value is null", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(PROPERTY, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(PROPERTY, null);
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));


        });

        it("should remove an attribute using .removeAria()", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(PROPERTY, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            jQelement.removeAria(PROPERTY);
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should be able to remove multiple attributes at once", function () {

            var value = randomString();
            var property1 = "label";
            var property2 = "placeholder";
            var attribute1 = "aria-" + property1;
            var attribute2 = "aria-" + property2;

            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));
            jQelement.aria(property1, value);
            jQelement.aria(property2, value);
            chai.assert.isTrue(element.hasAttribute(attribute1));
            chai.assert.isTrue(element.hasAttribute(attribute2));
            jQelement.removeAria(property1 + " " + property2);
            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));

        });

        it("should ignore an \"aria-\" prefix when deleting", function () {

            var value = randomString();

            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(ATTRIBUTE, value);
            chai.assert.isTrue(element.hasAttribute(ATTRIBUTE));
            jQelement.aria(ATTRIBUTE, "");
            chai.assert.isFalse(element.hasAttribute(ATTRIBUTE));

        });

        it("should ignore an \"aria-\" prefix when deleting multiple", function () {

            var value = randomString();
            var property1 = "label";
            var property2 = "placeholder";
            var attribute1 = "aria-" + property1;
            var attribute2 = "aria-" + property2;

            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));
            jQelement.aria(property1, value);
            jQelement.aria(property2, value);
            chai.assert.isTrue(element.hasAttribute(attribute1));
            chai.assert.isTrue(element.hasAttribute(attribute2));
            jQelement.removeAria(attribute1 + " " + attribute2);
            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));
        });

        it("should only remove the requested attribute with .removeAria()", function () {

            var value = randomString();
            var property1 = "label";
            var property2 = "placeholder";
            var attribute1 = "aria-" + property1;
            var attribute2 = "aria-" + property2;

            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));
            jQelement.aria(property1, value);
            jQelement.aria(property2, value);
            chai.assert.isTrue(element.hasAttribute(attribute1));
            chai.assert.isTrue(element.hasAttribute(attribute2));
            jQelement.removeAria(property1);
            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isTrue(element.hasAttribute(attribute2));

        });

        it("should only remove the requested attributes with .removeAria()", function () {

            var value = randomString();
            var property1 = "label";
            var property2 = "placeholder";
            var property3 = "roledescription";
            var attribute1 = "aria-" + property1;
            var attribute2 = "aria-" + property2;
            var attribute3 = "aria-" + property3;

            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));
            chai.assert.isFalse(element.hasAttribute(attribute3));
            jQelement.aria(property1, value);
            jQelement.aria(property2, value);
            jQelement.aria(property3, value);
            chai.assert.isTrue(element.hasAttribute(attribute1));
            chai.assert.isTrue(element.hasAttribute(attribute2));
            chai.assert.isTrue(element.hasAttribute(attribute3));
            jQelement.removeAria(property1 + " " + property2);
            chai.assert.isFalse(element.hasAttribute(attribute1));
            chai.assert.isFalse(element.hasAttribute(attribute2));
            chai.assert.isTrue(element.hasAttribute(attribute3));

        });

    });

    describe("role", function () {

        it("should be able to set a role using $.fn.role()", function () {

            var role = "alert";
            chai.assert.isFalse(element.hasAttribute("role"));
            jQelement.role(role);
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), role);

        });

        it("should be able to set multiple roles by passing a space-separated string to $.fn.role()", function () {

            var roles = [
                "alert",
                "alertdialog"
            ];
            chai.assert.isFalse(element.hasAttribute("role"));
            jQelement.role(roles.join(" "));
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles.join(" "));

        });

        it("should be able to set multiple roles by passing an array to $.fn.role()", function () {

            var roles = [
                "alert",
                "alertdialog"
            ];
            chai.assert.isFalse(element.hasAttribute("role"));
            jQelement.role(roles);
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles.join(" "));

        });

        it("should be able to remove a role using $.fn.removeRole()", function () {

            var roles = [
                "alert",
                "alertdialog"
            ];
            chai.assert.isFalse(element.hasAttribute("role"));
            jQelement.role(roles);
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles.join(" "));
            jQelement.removeRole(roles[0]);
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles[1]);

        });

        it("should be able to remove multiple roles using $.fn.removeRole()", function () {

            var roles = [
                "alert",
                "alertdialog",
                "application"
            ];
            chai.assert.isFalse(element.hasAttribute("role"));
            jQelement.role(roles);
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles.join(" "));
            jQelement.removeRole(roles.slice(1).join(" "));
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles[0]);

        });

        it("should be able to remove all roles using $.fn.removeRole()", function () {

            var roles = [
                "alert",
                "alertdialog"
            ];
            chai.assert.isFalse(element.hasAttribute("role"));
            jQelement.role(roles);
            chai.assert.isTrue(element.hasAttribute("role"));
            chai.assert.strictEqual(element.getAttribute("role"), roles.join(" "));
            jQelement.removeRole();
            chai.assert.isFalse(element.hasAttribute("role"));

        });

    });

    describe("identifying", function () {

        it("should return the ID of an element using $.fn.identify()", function () {

            var id = randomString("id-");
            var div = document.createElement("div");
            div.id = id;

            chai.assert.strictEqual($(div).identify(), id);

        });

        it("should only return the ID of the first element", function () {

            var divs = [
                document.createElement("div"),
                document.createElement("div")
            ];
            var ids = [
                randomString("id-"),
                randomString("id-")
            ];
            divs[0].id = ids[0];
            divs[1].id = ids[1];
            chai.assert.strictEqual($(divs).identify(), ids[0]);
            chai.assert.notStrictEqual($(divs).identify(), ids[1]);

        });

        it("should only generate an ID for the first element", function () {

            var divs = [
                document.createElement("div"),
                document.createElement("div")
            ];
            $(divs).identify();
            chai.assert.isTrue(divs[0].hasAttribute("id"));
            chai.assert.isFalse(divs[1].hasAttribute("id"));

        });

        it("should create an ID for an element without one", function () {

            var div = document.createElement("div");
            document.body.appendChild(div);

            chai.assert.isFalse(div.hasAttribute("id"));
            $(div).identify();
            chai.assert.isTrue(div.hasAttribute("id"));
            document.body.removeChild(div);

        });

        it("should create a unique ID", function () {

            var divs = [
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div")
            ];
            document.body.appendChild(divs[0]);
            document.body.appendChild(divs[1]);
            document.body.appendChild(divs[2]);
            var id = Aria.identify(divs[0]);
            var idNumber = Number(id.match(/(\d+)$/)[1]);
            var idStem = id.replace(idNumber, "");
            divs[1].id = idStem + (idNumber + 1);

            chai.assert.notStrictEqual(
                $(divs[1]).attr("id"),
                $(divs[2]).identify()
            );

            document.body.removeChild(divs[0]);
            document.body.removeChild(divs[1]);
            document.body.removeChild(divs[2]);

        });

    });

    describe("hooks", function () {

        it("shouldn't have anything for aria-label", function () {
            chai.assert.notProperty($.ariaHooks, "label");
        });

        it("should modify the returned result using $.ariaHooks[attribute].get", function () {

            var value = randomString().toLowerCase();

            $.ariaHooks.label = {
                get: function (element) {
                    return (element.getAttribute("aria-label") || "").toUpperCase();
                }
            };

            var jQelement = $("<div/>");
            jQelement.aria("label", value);

            chai.assert.notStrictEqual(jQelement.aria("label"), value);
            chai.assert.strictEqual(jQelement.aria("label"), value.toUpperCase());

            delete $.ariaHooks.label;

        });

        it("should modify the result being set using $.ariaHooks[attribute].set", function () {

            var value = randomString().toLowerCase();

            $.ariaHooks.label = {
                set: function (element, value) {
                    element.setAttribute("aria-label", value.toUpperCase());
                }
            };

            var jQelement = $("<div/>");
            jQelement.aria("label", value);

            chai.assert.notStrictEqual(jQelement.aria("label"), value);
            chai.assert.strictEqual(jQelement.aria("label"), value.toUpperCase());

            delete $.ariaHooks.label;

        });

    });

});
