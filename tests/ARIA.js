describe("ARIA", function () {

    describe("VERSION", function () {

        it("should be a string of numbers", function () {

            chai.assert.isDefined(ARIA.VERSION);
            chai.assert.isTrue((/^\d+(\.\d+)+$/).test(ARIA.VERSION));

        });

        it("should not be changable", function () {

            var version = ARIA.VERSION;
            var different = "abc";

            ARIA.VERSION = different;

            chai.assert.notEqual(ARIA.VERSION, different);
            chai.assert.equal(ARIA.VERSION, version);

        });

    });

    describe("getById", function () {

        it("should find an element by ID", function () {

            var element = document.createElement("div");
            var id = makeUniqueId();

            element.id = id;
            document.body.appendChild(element);
            chai.assert.equal(ARIA.getById(id), element);
            document.body.removeChild(element);

        });

        it("should return null for elements that can't be found", function () {
            chai.assert.isNull(ARIA.getById(makeUniqueId()));
        });

    });

    describe("identify", function () {

        it("should return the ID of an element", function () {

            var div = document.createElement("div");
            div.id =  makeUniqueId();

            chai.assert.equal(ARIA.identify(div), div.id);

        });

        it("should generate an ID if the element needs one", function () {

            var div = document.createElement("div");
            var newId = ARIA.identify(div);

            chai.assert.isNotNull(div.getAttribute("id"));
            chai.assert.equal(newId, div.id);

        });

        it("should allow us to set the prefix", function () {

            var div = document.createElement("div");
            var newId = ARIA.identify(div, "id-");

            chai.assert.isTrue((/^id\-/).test(newId));

        });

        it("should allow us to change the default prefix", function () {

            var divs = [
                document.createElement("div"),
                document.createElement("div")
            ];
            var prefix = ARIA.defaultIdentifyPrefix;
            var createdDefault = makeUniqueId();

            chai.assert.notEqual(prefix, createdDefault);
            chai.assert.equal(ARIA.identify(divs[0]).substr(0, prefix.length), prefix);

            ARIA.defaultIdentifyPrefix = createdDefault;
            chai.assert.equal(ARIA.identify(divs[1]).substr(0, createdDefault.length), createdDefault);

            ARIA.defaultIdentifyPrefix = prefix;

        });

        it("should allow results to be translated", function () {

            var one = "aria-" + makeUniqueId();
            var two = "aria-" + makeUniqueId();

            ARIA.translate[one] = two;
            chai.assert.equal(ARIA.normalise(one), two);

            delete ARIA.translate[one];

        });

    });

    describe("normalise", function () {

        it("should prefix attributes with \"aria-\"", function () {
            chai.assert.equal(ARIA.normalise("busy"), "aria-busy");
        });

        it("should not modify already prefixed attributes", function () {

            var attribute = "aria-busy";

            chai.assert.equal(ARIA.normalise(attribute), attribute);

        });

        it("should trim and convert to lowercase", function () {

            chai.assert.equal(ARIA.normalise(" aria-busy "), "aria-busy");
            chai.assert.equal(ARIA.normalise(" BUSY "), "aria-busy");

        });

        it("should have the alias of \"normalize\"", function () {

            var normalise = ARIA.normalise;
            var newNormal = function (attr) {
                return attr.toUpperCase();
            };

            chai.assert.equal(ARIA.normalise, ARIA.normalize);

            ARIA.normalise = newNormal;
            chai.assert.equal(ARIA.normalise, ARIA.normalize);

            ARIA.normalise = normalise;

        });

    });

    describe("createClass", function () {

        it("should create a class", function () {

            var Thing = ARIA.createClass({

                init: function (name) {
                    this.name = name;
                },

                getName: function () {
                    return name;
                }

            });
            var name = makeUniqueId();
            var thing = new Thing(name);

            chai.assert.equal(thing.name, name);
            chai.assert.equal(thing.getName(), name);

        });

        it("should allow for inheritance", function () {

            var Parent = ARIA.createClass({

                init: function (name) {
                    this.name = name;
                },

                getName: function () {
                    return name;
                }

            });
            var Child = ARIA.createClass(Parent, {

                init: function (name, age) {
                    this.$super(name);
                    this.age = age;
                },

                getAge: function () {
                    return this.age;
                }

            });
            var name = makeUniqueId();
            var age = Math.floor(Math.random() * 100);
            var child = new Child(name, age);

            chai.assert.equal(child.name, name);
            chai.assert.equal(child.getName(), name);
            chai.assert.equal(child.age, age);
            chai.assert.equal(child.getAge(), age);

        });

        it("should allow methods to be added to a class", function () {

            var Parent = ARIA.createClass({

                init: function (name) {
                    this.name = name;
                }

            });
            var Child = ARIA.createClass(Parent, {

                init: function (name, age) {
                    this.$super(name);
                    this.age = age;
                }

            });
            Parent.addMethod("getName", function () {
                return this.name;
            });
            Child.addMethod({
                getName: function () {
                    return this.$super().toUpperCase();
                }
            });
            var name = "abcdef" + makeUniqueId();
            var age = Math.floor(Math.random() * 100);
            var child = new Child(name, age);

            chai.assert.equal(child.name, name);
            chai.assert.equal(child.age, age);
            chai.assert.equal(child.getName(), name.toUpperCase());

        });

    });

    describe("runFactory", function () {

        it("should allow a factory to be executed", function () {

            var attr = makeUniqueId();
            var Thing = ARIA.createClass({

                init: function (name, age) {
                    this.name = name;
                    this.age = age;
                }

            });
            var name = makeUniqueId();
            var age = Math.floor(Math.random() * 100);

            ARIA.factories[attr] = function (name, age) {
                return new Thing(name, age);
            };

            var instance = ARIA.runFactory(attr, name, age);
            chai.assert.equal(instance.name, name);
            chai.assert.equal(instance.age, age);

            delete ARIA.factories[attr];

        });

    });

    describe("addAlias", function () {

        it("should throw an error if it cannot alias something", function () {

            chai.assert.throws(function () {
                ARIA.addAlias(makeUniqueId(), makeUniqueId());
            });

        });

        it("should allow an alias to be created", function () {

            var one = makeUniqueId();
            var two = makeUniqueId();
            var Thing = function (age) {
                this.age = age;
            };

            ARIA.factories[one] = function (age) {
                return new Thing(age);
            };
            ARIA.addAlias(one, two);

            var instanceOne = ARIA.runFactory(one, 1);
            var instanceTwo = ARIA.runFactory(two, 2);

            chai.assert.equal(instanceOne.age, 1);
            chai.assert.equal(instanceTwo.age, 2);

            delete ARIA.factories[one];
            delete ARIA.factories[two];
            delete ARIA.translate[one];
            delete ARIA.translate[two];

        });

    });

    describe("isNode", function () {

        it("should detect a Node", function () {

            chai.assert.isTrue(ARIA.isNode(document.createElement("div")));
            chai.assert.isFalse(ARIA.isNode({}));

        });

    });

    describe("makeFocusable", function () {

        it("should allow an element to become focusable", function () {

            var div = document.createElement("div");

            ARIA.makeFocusable(div);
            chai.assert.equal(div.getAttribute("tabindex"), "0");

        });

        it("should allow allow the tabindex to be set", function () {

            var div = document.createElement("div");
            var tabindex = Math.floor(Math.random() * 10);

            ARIA.makeFocusable(div, tabindex);
            chai.assert.equal(div.getAttribute("tabindex"), String(tabindex));

        });

    });

    describe("makeUnfocusable", function () {

        it("should remove the element from the tab order", function () {

            var div = document.createElement("div");

            ARIA.makeUnfocusable(div);
            chai.assert.equal(div.getAttribute("tabindex"), "-1");

        });

    });

    describe("resetFocusable", function () {

        it("should remove the tabindex from the element", function () {

            var div = document.createElement("div");

            ARIA.makeFocusable(div);
            chai.assert.isTrue(div.hasAttribute("tabindex"));
            ARIA.resetFocusable(div);
            chai.assert.isFalse(div.hasAttribute("tabindex"));

        });

    });

});
