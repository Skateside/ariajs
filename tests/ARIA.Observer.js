describe("ARIA.Observer", function () {

    var observer;

    beforeEach(function () {
        observer = new ARIA.Observer();
    });

    describe("constructor", function () {

        it("should allow a handler to be added to an event", function () {

            var eventName = "my-event";
            var hasFired = false;
            var changeHasFired = function () {
                hasFired = true;
            };

            observer.addEventListener(eventName, changeHasFired);
            observer.dispatchEvent(eventName);

            chai.assert.isTrue(hasFired);

        });

        it("should allow a handler to be removed", function () {

            var eventName = "my-event";
            var hasFired = false;
            var changeHasFired = function () {
                hasFired = true;
            };

            observer.addEventListener(eventName, changeHasFired);
            observer.removeEventListener(eventName, changeHasFired);
            observer.dispatchEvent(eventName);

            chai.assert.isFalse(hasFired);

        });

        it("should not throw any errors if the event has no handlers", function () {

            chai.assert.doesNotThrow(function () {
                observer.dispatchEvent(makeUniqueId());
            });

        });

        it("should allow detail to be passed to the event", function () {

            var info = makeUniqueId();
            var heard;
            var eventName = "my-event";

            observer.addEventListener(eventName, function (e) {
                heard = e.detail;
            });
            observer.dispatchEvent(eventName, info);
            chai.assert.equal(heard, info);

        });

        it("should return the dispatched event", function () {

            observer.addEventListener("my-event", function (e) {
                e.preventDefault();
            });
            var event = observer.dispatchEvent("my-event");
            chai.assert.isTrue(event.defaultPrevented);

        });

    });

    describe("instance", function () {

        it("should act like the constructor", function () {

            var eventName = makeUniqueId();
            var hasFired = false;

            ARIA.observer.addEventListener(eventName, function () {
                hasFired = true;
            });
            ARIA.observer.dispatchEvent(eventName);

            chai.assert.isTrue(hasFired);

        });

    });

    describe("interface", function () {

        it("should act like the constructor", function () {

            var eventName = makeUniqueId();
            var hasFired = false;

            ARIA.on(eventName, function () {
                hasFired = true;
            });
            ARIA.trigger(eventName);

            chai.assert.isTrue(hasFired);

        });

    });

});
