import Observer from "~/Observer.js";
import {
    randomString
} from "~j/jest-common.js";

describe("Observer", () => {

    let observer;

    beforeEach(() => {
        observer = new Observer();
    });

    test("can hear and dispatch events", () => {

        let eventName = "event_" + randomString();
        let isHeard = false;

        observer.addEventListener(eventName, () => isHeard = true);
        observer.dispatchEvent(eventName);
        expect(isHeard).toBe(true);

    });

    test("can have multiple listeners", () => {

        let eventName = "event_" + randomString();
        let heard = 0;

        observer.addEventListener(eventName, () => heard += 1);
        observer.addEventListener(eventName, () => heard += 1);
        observer.dispatchEvent(eventName);
        expect(heard).toBe(2);

    });

    test("can pass information to event", () => {

        let eventName = "event_" + randomString();
        let info = randomString();
        let heardString = "";

        observer.addEventListener(eventName, ({ detail }) => heardString = detail);
        observer.dispatchEvent(eventName, info);
        expect(heardString).toBe(info);

    });

});
