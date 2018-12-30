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

        // it("should allow results to be translated", function () {
        //
        //     var one = "aria-" + makeUniqueId();
        //     var two = "aria-" + makeUniqueId();
        //
        //     ARIA.translate[one] = two;
        //     chai.assert.equal(ARIA.addPrefix(one), two);
        //
        //     delete ARIA.translate[one];
        //
        // });

    });

    describe("addPrefix", function () {

        it("should prefix attributes with \"aria-\"", function () {
            chai.assert.equal(ARIA.addPrefix("busy"), "aria-busy");
        });

        it("should not modify already prefixed attributes", function () {

            var attribute = "aria-busy";

            chai.assert.equal(ARIA.addPrefix(attribute), attribute);

        });

        it("should trim and convert to lowercase", function () {

            chai.assert.equal(ARIA.addPrefix(" aria-busy "), "aria-busy");
            chai.assert.equal(ARIA.addPrefix(" BUSY "), "aria-busy");

        });

        it("should read values from ARIA.prefixCache", function () {

            var one = makeUniqueId();
            var two = makeUniqueId();

            ARIA.prefixCache[one] = two;
            chai.assert.equal(ARIA.addPrefix(one), two);
            delete ARIA.prefixCache[one];

        });

        it("should be able to translate conversions using ARIA.translate", function () {

            var one = makeUniqueId();
            var two = makeUniqueId();

            ARIA.translate[one] = two;
            chai.assert.equal(ARIA.addPrefix(one), two);
            delete ARIA.translate[one];

        });

    });

    describe("removePrefix", function () {

        it("should remove the leading \"aria-\" from attributes", function () {
            chai.assert.equal(ARIA.removePrefix("aria-busy"), "busy");
        });

        it("should trim and convert to lowercase before removing", function () {

            chai.assert.equal("busy", ARIA.removePrefix(" aria-busy "));
            chai.assert.equal("busy", ARIA.removePrefix(" ARIA-BUSY "));

        });

        it("should not change attributes without a leading prefix", function () {
            chai.assert.equal(ARIA.removePrefix("data-busy"), "data-busy");
        });

        it("should read values from ARIA.suffixCache", function () {

            var one = makeUniqueId();
            var two = makeUniqueId();

            ARIA.suffixCache[one] = two;
            chai.assert.equal(ARIA.removePrefix(one), two);
            delete ARIA.suffixCache[one];

        });

        it("should remove the match defined in ARIA.PREFIX_REGEXP", function () {

            var regexp = ARIA.PREFIX_REGEXP;
            var attribute = makeUniqueId();

            ARIA.PREFIX_REGEXP = (/^data\-/);
            chai.assert.equal(ARIA.removePrefix("data-" + attribute), attribute);
            ARIA.PREFIX_REGEXP = regexp;

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
            var age = rnd(100);
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
            var age = rnd(100);
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
                init: function (name) {
                    this.name = name;
                }
            });
            var name = makeUniqueId();

            ARIA.factories[attr] = function (name) {
                return new Thing(name);
            };

            var instance = ARIA.runFactory(attr, name);
            chai.assert.equal(instance.name, name);

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

    describe("setAttribute", function () {

        it("should set an attribute", function () {

            var div = document.createElement("div");
            var value = makeUniqueId();

            ARIA.setAttribute(div, "data-test", value);
            chai.assert.equal(div.getAttribute("data-test"), value);

        });

    });

    describe("getAttribute", function () {

        it("should get the value of an attribute", function () {

            var div = document.createElement("div");
            var value = makeUniqueId();

            div.setAttribute("data-test", value);
            chai.assert.equal(ARIA.getAttribute(div, "data-test"), value);

        });

        it("should return null if there is no attribute", function () {

            chai.assert.isNull(
                ARIA.getAttribute(document.createElement("div"), "data-test")
            );

        });

    });

    describe("hasAttribute", function () {

        it("should check whether or not an element has an attribute", function () {

            var div = document.createElement("div");

            div.setAttribute("data-has", "true");
            chai.assert.isTrue(ARIA.hasAttribute(div, "data-has"));
            chai.assert.isFalse(ARIA.hasAttribute(div, "data-has-not"));

        });

    });

    describe("removeAttribute", function () {

        it("should remove an attribute", function () {

            var div = document.createElement("div");

            div.setAttribute("data-test", "true");
            chai.assert.isTrue(div.hasAttribute("data-test"));
            ARIA.removeAttribute(div, "data-test");
            chai.assert.isFalse(div.hasAttribute("data-test"));

        });

        it("should not throw an error if there is no attribute", function () {

            chai.assert.doesNotThrow(function () {
                ARIA.removeAttribute(document.createElement("div"), makeUniqueId());
            });

        });

    });

    describe("isNode", function () {

        it("should detect a Node", function () {

            chai.assert.isTrue(ARIA.isNode(document.createElement("div")));
            chai.assert.isFalse(ARIA.isNode({}));

        });

    });

    describe("getPrevious", function () {

        var myARIA = window.ARIA;
        var previousARIA = window.previousARIA;

        it("should return the previous version of ARIA", function () {

            var previous = ARIA.getPrevious();

            chai.assert.notEqual(myARIA, previous);
            chai.assert.equal(previousARIA, previous);

        });

    });

    describe("restorePrevious", function () {

        var myARIA = window.ARIA;
        var previousARIA = window.previousARIA;

        it("should remove the current version from the global namespace", function () {

            ARIA.restorePrevious();
            chai.assert.notEqual(myARIA, window.ARIA);
            window.ARIA = myARIA;

        });

        it("should return ARIA", function () {

            var value = ARIA.restorePrevious();

            chai.assert.equal(value, myARIA);
            window.ARIA = myARIA;

        });

        it("should restore the previous value of ARIA", function () {

            ARIA.restorePrevious();

            chai.assert.equal(window.previousARIA, window.ARIA);
            window.ARIA = myARIA;

        });

    });


});
