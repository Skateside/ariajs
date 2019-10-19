import ObservableBasicType from "../../rewrite/types/ObservableBasicType.js";
import Observer from "../../rewrite/Observer.js";
import {
    randomString
} from "../jest-common.js";

describe("ObservableBasicType", () => {

    let observable;
    let observer = new Observer();

    beforeEach(() => {

        observable = new ObservableBasicType();
        observable.setObserver(observer);

    });

    test("writing a value should dispatch an event", () => {

        let isFired = false;
        let type;

        observer.addEventListener(ObservableBasicType.EVENT_UPDATED, ({ detail }) => {

            isFired = true;
            type = detail.type;

        });

        observable.write(randomString());

        expect(isFired).toBe(true);
        expect(type).toBe(observable);

    });

    test("observe() should listen for changes", () => {

        let isFired = false;
        let type;

        observable.observe(({ detail }) => {

            isFired = true;
            type = detail.type;

        });

        observable.write(randomString());

        expect(isFired).toBe(true);
        expect(type).toBe(observable);

    });

    test("observe() should only listen to its own changes", () => {

        let isFired = false;
        let isOtherFired = false;
        let other = new ObservableBasicType();
        other.setObserver(observer);

        observable.observe(() => isFired = true);
        other.observe(() => isOtherFired = true);
        observable.write(randomString());
        
        expect(isFired).toBe(true);
        expect(isOtherFired).toBe(false);

    });

});
