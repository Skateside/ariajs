import ListType from "../../rewrite/types/ListType.js";
import ListFacade from "../../rewrite/facades/ListFacade.js";
import {
    randomString
} from "../jest-common.js";

describe("ListType", () => {

    let list;

    beforeEach(() => {
        list = new ListType();
    });

    test("coerce() should convert values into an array", () => {

        // Null, undefined and "empty" strings should turn into an empty array.
        expect(list.coerce(null)).toEqual([]);
        expect(list.coerce(undefined)).toEqual([]);
        expect(list.coerce("")).toEqual([]);
        expect(list.coerce(" ")).toEqual([]);

        // Other strings should be trimmed and split on spaces.
        expect(list.coerce("a b")).toEqual(["a", "b"]);
        expect(list.coerce("a  b")).toEqual(["a", "b"]);
        expect(list.coerce(" a  b ")).toEqual(["a", "b"]);

        // Arrays and array-likes should be converted into an array.
        expect(list.coerce(["a", "b"])).toEqual(["a", "b"]);
        let div0 = document.createElement("div");
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        div0.appendChild(div1);
        div0.appendChild(div2);
        expect(list.coerce(div0.querySelectorAll("div"))).toEqual([div1, div2]);

        // Everything else should just turn into an array.
        expect(list.coerce(123)).toEqual([123]);

    });

    test("size() [private] should return the length", () => {

        expect(list.size()).toBe(0);
        list.write(["a", "b"]);
        expect(list.size()).toBe(2);

    });

    test("write() will only add unique items", () => {

        list.write(["a", "b", "a"]);
        expect(list.size()).toBe(2);

    });

    test("add() will take any number of parameters", () => {

        expect(list.size()).toBe(0);
        list.add(randomString());
        expect(list.size()).toBe(1);
        list.add(randomString(), randomString());
        expect(list.size()).toBe(3);

    });

    test("add() will only add unique items", () => {

        list.add("a");
        expect(list.size()).toBe(1);
        list.add("a");
        expect(list.size()).toBe(1);

    });

    test("remove() will remove any number of parameters", () => {

        let strings = [
            randomString(),
            randomString(),
            randomString()
        ];
        list.write(strings);
        expect(list.size()).toBe(3);
        list.remove(strings[0]);
        expect(list.size()).toBe(2);
        list.remove(strings[1], strings[2]);
        expect(list.size()).toBe(0);

    });

    test("list can be converted into an array", () => {

        let strings = [
            randomString(),
            randomString(),
            randomString()
        ];
        list.write(strings);
        expect([...list]).toEqual(strings);

    });

    test("replace() can replace one value with another", () => {

        // If the string doesn't match, don't do anything.
        list.replace(randomString(), randomString());
        expect(list.size()).toBe(0);

        let string0 = randomString();
        let string1 = randomString();
        let string2 = randomString();
        list.add(string0, string1);
        expect([...list]).toEqual([string0, string1]);
        list.replace(string0, string2);
        expect([...list]).toEqual([string2, string1]);

    });

    test("forEach() can iterate over the items", () => {

        let found = [];
        let strings = [
            randomString(),
            randomString(),
            randomString()
        ];
        let mapped = strings.map((string, i) => [i, string]);
        list.write(strings);

        list.forEach((value, index) => found.push([index, value]));
        expect(found).toEqual(mapped);

    });

    test("toggle() toggles a value", () => {

        let string = randomString();

        list.toggle(string);
        expect(list.size()).toBe(1);
        list.toggle(string);
        expect(list.size()).toBe(0);

        list.toggle(string, true);
        expect(list.size()).toBe(1);
        list.toggle(string, true);
        expect(list.size()).toBe(1);

        list.toggle(string, false);
        expect(list.size()).toBe(0);
        list.toggle(string, false);
        expect(list.size()).toBe(0);

    });

    test("contains() returns whether or not the value is in the list", () => {

        let included = randomString();
        let excluded = randomString();

        list.add(included);
        expect(list.contains(included)).toBe(true);
        expect(list.contains(excluded)).toBe(false);

    });

    test("item() should get the value at the given index", () => {

        let string = randomString();
        list.add(string);
        expect(list.item(0)).toBe(string);
        expect(list.item(1)).toBeNull();
        expect(list.item(randomString())).toBeNull();

    });

    test("read() returns a ListFacade", () => {
        expect(list.read() instanceof ListFacade).toBe(true);
    });

    test("read() looks like a DOMTokenList", () => {

        let facade = list.read();

        expect(typeof facade.add).toBe("function");
        expect(typeof facade.remove).toBe("function");
        expect(typeof facade.item).toBe("function");
        expect(typeof facade.toggle).toBe("function");
        expect(typeof facade.contains).toBe("function");
        expect(typeof facade.replace).toBe("function");

    });

    test("read() can be driven like an array", () => {

        let string = randomString();
        list.add(string);
        let facade = list.read();

        expect(facade.length).toBe(1);
        expect(facade[0]).toBe(string);
        expect(facade[facade.length]).toBeUndefined();
        expect([...facade]).toEqual([string]);

    });

    test("coerce() should correctly coerce read()", () => {

        let string = randomString();
        list.add(string);
        let facade = list.read();
        expect(list.coerce(facade)).toEqual([string]);

    });

});
