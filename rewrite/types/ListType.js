import BasicType from "./BasicType.js";
import Facade from "../Facade.js";

export default class ListType extends BasicType {

    static facadeMethods = [
        "add",
        "remove",
        "contains",
        "toggle",
        "keys",
        "values",
        "entries",
        Symbol.iterator,
        "toString"
    ];

    constructor() {

        super(new Set());
        this.facade = new Facade(this, this.constructor.facadeMethods);

    }

    coerce(value) {

        if (
            value === ""
            || value === undefined
            || value === null
            || (typeof value === "string" && value.trim() === "")
        ) {
            return [];
        }

        if (typeof value === "string") {
            return value.trim().split(/\s+/);
        }

        if (value[Symbol.iterator]) {
            return [...value];
        }

        return [value];

    }

    write(value) {

        this.value.clear();
        this.add(...this.coerce(value));

    }

    read() {
        return this.facade;
    }

    add(...values) {
        values.forEach((value) => this.value.add(value));
    }

    remove(...values) {
        values.forEach((value) => this.value.delete(value));
    }

    contains(value) {
        return this.value.has(value);
    }

    toggle(value, force) {

        if (force === undefined) {
            force = !this.contains(value);
        }

        this[
            force
            ? "add"
            : "remove"
        ](value);

    }

    forEach(handler, context) {
        this.value.forEach((value, i) => handler.call(context, value, i));
    }

    keys() {
        return this.value.keys();
    }

    values() {
        return this.value.values();
    }

    entries() {
        return this.value.entries();
    }

    [Symbol.iterator]() {
        return this.value.values();
    }

    toString() {
        return [...this.value].join(" ");
    }

}
