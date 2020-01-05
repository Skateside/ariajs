import Sandbox from "~/Sandbox.js";
import {
    randomString
} from "~j/jest-common.js";

describe("Sandbox", () => {

    let sandbox;

    beforeEach(() => {
        sandbox = new Sandbox();
    });

    test("register() can register modules", () => {

        let name = randomString();

        class Test {
            constructor() {
                this.name = name;
            }
        }

        sandbox[Sandbox.register](name, Test);
        Sandbox.use((sand) => {

            expect(sand[name]).toBe(Test);
            let test = new sand[name]();
            expect(test.name).toBe(name);

        });

    });

    test("register() can override modules", () => {

        let name = randomString();

        class A {}
        class B {}

        expect(() => {
            sandbox[Sandbox.register](name, A);
            sandbox[Sandbox.register](name, B);
        }).not.toThrow();

    });

    test("deleting something from one sandbox does not remove it from another", () => {

        let name = randomString();
        class A {
            constructor() {
                this.name = name;
            }
        }

        sandbox[Sandbox.register](name, A);

        Sandbox.use((sand) => {
            delete sand[name];
            expect(sand[name]).toBe(undefined);
        });

        Sandbox.use((sand) => {

            expect(sand[name]).toBe(A);
            let a = new sand[name]();
            expect(a.name).toBe(name);

        });

    });

    test("replacing something from one sandbox is remembered by the next", () => {

        let name = randomString();
        class A {
            constructor() {
                this.name = "A";
            }
        }
        class B {
            constructor() {
                this.name = "B";
            }
        }

        sandbox[Sandbox.register](name, A);

        Sandbox.use((sand) => {

            let a = new sand[name]();
            expect(a.name).toBe("A");
            sand[Sandbox.register](name, B);

        });
        Sandbox.use((sand) => {

            let b = new sand[name]();
            expect(b.name).toBe("B");

        });

    });

});
