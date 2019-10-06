import ObservableBasicType from "./ObservableBasicType.js";
import ListFacade from "../facades/ListFacade.js";

export default class ListType extends ObservableBasicType {

    constructor() {

        super([]);
        this.facade = new ListFacade(this);

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

        this.value.length = 0;
        this.add(...this.coerce(value));
        this.announceUpdate();

        return !this.isEmpty();

    }

    read() {
        return this.facade;
    }

    add(...values) {

        values.forEach((value) => this.addUnique(value));
        this.dispatchEvent(this.constructor.EVENT_UPDATED);

    }

    remove(...values) {

        values.forEach((value) => this.removeValue(value));
        this.dispatchEvent(this.constructor.EVENT_UPDATED);

    }

    item(index) {

        let idx = this.coerceIndex(index);

        return (
            idx === null
            ? idx
            : this.lookup(idx)
        );

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

        this.dispatchEvent(this.constructor.EVENT_UPDATED);

        return true;

    }

    contains(value) {
        return this.value.includes(value);
    }

    replace(oldValue, newValue) {

        let index = this.indexOf(oldValue);

        if (index < 0) {
            return false;
        }

        this.value[index] = newValue;
        this.dispatchEvent(this.constructor.EVENT_UPDATED);

        return true;

    }

    toString() {
        return this.value.map((item) => item.toString()).join(" ");
    }

    forEach(handler, context) {
        this.value.forEach((value, i) => handler.call(context, value, i));
    }

    *keys() {

        let index = 0;
        let length = this.value.length;

        while (index < length) {
            yield index++;
        }

    }

    *values() {

        let index = 0;
        let length = this.value.length;

        while (index < length) {
            yield this.item(index++);
        }

    }

    *entries() {

        let index = 0;
        let length = this.value.length;

        while (index < length) {

            yield [index, this.item(index)];
            index += 1;

        }

    }

    [Symbol.iterator]() {
        return this.values();
    }

    indexOf(value) {
        return this.value.indexOf(value);
    }

    addUnique(value) {

        if (!this.contains(value)) {
            this.value.push(value);
        }

    }

    removeValue(value) {

        let index = this.indexOf(value);

        if (index > -1) {
            this.value.splice(index, 1);
        }

    }

    coerceIndex(index) {

        let idx = Math.floor(index);

        if (
            idx < 0
            || idx >= this.value.length
            || Number.isNaN(idx)
        ) {
            return null;
        }

        return idx;

    }

    lookup(index) {
        return this.value[index];
    }

    size() {
        return this.value.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    clear() {
        this.write([]);
    }

}
