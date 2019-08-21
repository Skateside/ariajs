import StringType from "./StringType.js";

class ListType extends StringType {

    constructor() {
        super();
        this.value = new Set();
    }

    coerceToArray(value) {

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
        this.coerceToArray(value).forEach((coerced) => this.value.add(coerced));

    }

    read() {
        return [...super.read()];
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

    item(i) {

        let value = [...this.value];
        let item;

        if (Object.prototype.hasOwnProperty.call(value, i)) {
            item = value[i];
        }

        return item;

    }

    forEach(handler, context) {
        this.value.forEach((value, i) => handler.call(context, value, i));
    }

    keys() {
        return this.value.keys();

        // let value = this.value;
        // let i = 0;
        // let il = value.length;
        //
        // while (i < il) {
        //     yield i++;
        // }

    }

    values() {

        return this.value.values();

        // let value = this.value;
        // let i = 0;
        // let il = value.length;
        //
        // while (i < il) {
        //     yield value[i++];
        // }

    }

    entries() {

        return this.value.entries();

        // let value = this.value;
        // let i = 0;
        // let il = value.length;
        //
        // while (i < il) {
        //     yield [i, value[i++]];
        // }

    }

    [Symbol.iterator]() {
        return this.value.values();
        // let value = this.value;
        // let i = 0;
        // let il = value.length;
        //
        // while (i < il) {
        //     yield value[i++];
        // }

    }

    toString() {
        return [...this.value].join(" ");
    }
    
}
