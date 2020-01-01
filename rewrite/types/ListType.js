import ObservableBasicType from "./ObservableBasicType.js";
import ListFacade from "~/facades/ListFacade.js";

/**
 * Handles lists of values.
 * @class ListType
 * @extends ObservableBasicType
 */
export default class ListType extends ObservableBasicType {

    /**
     * @inheritDoc
     */
    constructor() {

        super([]);

        /**
         * The facade that is returned from {@link List#read}.
         * @type {ListFacade}
         */
        this.facade = new ListFacade(this);

    }

    /**
     * Coerces the given value into an array. This is done by either splitting a
     * string at the spaces or spreading an array. If the value is empty, an
     * empty array is returned. If all else fails, the give is wrapped in an
     * array and returned.
     *
     * @param  {?} value
     *         Value to convert into an array.
     * @return {Array}
     *         Converted array.
     */
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

    /**
     * @inheritDoc
     */
    write(value) {

        this.value.length = 0;
        this.add(...this.coerce(value));
        this.announceUpdate();

        return true;

    }

    /**
     * Exposes {@link ListType#facade}.
     *
     * @return {ListFacade}
     *         The facade for the current instance.
     */
    read() {
        return this.facade;
    }

    /**
     * Adds the given values to the list. Only unique values are added.
     *
     * @param {...?} values
     *        Values to add.
     */
    add(...values) {

        values.forEach((value) => this.addUnique(value));
        this.announceUpdate();

    }

    /**
     * Removes values from the list.
     *
     * @param {...?} values
     *        Values to remove.
     */
    remove(...values) {

        values.forEach((value) => this.removeValue(value));
        this.announceUpdate();

    }

    /**
     * Returns the item at the given index. If the given index is not understood
     * as an index of the list, null is returned. This can bappen if the numeric
     * index given is outside of the range of the current list.
     *
     * @param  {Number|String} index
     *         Number or numeric string.
     * @return {?}
     *         Either the value at the given index or null.
     */
    item(index) {

        let idx = this.coerceIndex(index);

        return (
            idx === null
            ? idx
            : this.lookup(idx)
        );

    }

    /**
     * Toggles the given value. Optionally, the value can be forces to be added
     * or removed. If the value is being added but is not unique, it will not be
     * added.
     *
     * @param  {?} value
     *         Value to toggle.
     * @param  {Boolean} [force]
     *         If provided, true will make add the value and false will remove
     *         the value.
     * @return {Boolean}
     *         true.
     */
    toggle(value, force) {

        if (force === undefined) {
            force = !this.contains(value);
        }

        this[
            force
            ? "add"
            : "remove"
        ](value);

        this.announceUpdate();

        return true;

    }

    /**
     * Checks to see if the given value is in {@link ListType#value}.
     *
     * @param  {?} value
     *         Value to check for.
     * @return {Boolean}
     *         true if the value is in  {@link ListType#value}, false otherwise.
     */
    contains(value) {
        return this.value.includes(value);
    }

    /**
     * Replaces the given old value with the given new value.
     *
     * @param  {?} oldValue
     *         Old value to replace.
     * @param  {?} newValue
     *         New value that replaces the old value.
     * @return {Boolean}
     *         true if the value was replaced, false if oldValue is not found in
     *         {@link ListType#value}.
     */
    replace(oldValue, newValue) {

        let index = this.indexOf(oldValue);

        if (index < 0) {
            return false;
        }

        this.value[index] = newValue;
        this.announceUpdate();

        return true;

    }

    /**
     * Converts the values in {@link ListType#value} into strings and joins them
     * with a space character.
     *
     * @return {String}
     *         Space-separated list.
     */
    toString() {
        return this.value.map(this.constructor.stringify).join(" ");
    }

    /**
     * Executes a function for each item in {@link ListType#value}.
     *
     * @param {Function} handler
     *        Handler to execute for all items. It is passed the item, the index
     *        and an array matching the values.
     * @param {?} [context]
     *        Optional context for the handler.
     */
    forEach(handler, context) {

        let list = [...this.value];

        this.value.forEach((value, i) => handler.call(context, value, i, list));

    }

    /**
     * A Generator that yields the indices.
     *
     * @return {Generator}
     *         Indicies of {@link ListType#value}.
     */
    *keys() {

        let index = 0;
        let length = this.value.length;

        while (index < length) {
            yield index++;
        }

    }

    /**
     * A Generator that yields the values.
     *
     * @return {Generator}
     *         Values in {@link ListType#value}.
     */
    *values() {

        let index = 0;
        let length = this.value.length;

        while (index < length) {
            yield this.item(index++);
        }

    }

    /**
     * A Generator that yields the entries.
     *
     * @return {Generator}
     *         Entries of {@link ListType#value}.
     */
    *entries() {

        let index = 0;
        let length = this.value.length;

        while (index < length) {

            yield [index, this.item(index)];
            index += 1;

        }

    }

    /**
     * A Generator that yields the values.
     *
     * @return {Generator}
     *         Values in {@link ListType#value}.
     */
    [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Returns the index of the given value.
     *
     * @private
     * @param   {?} value
     *          Value whose index should be returned.
     * @return  {Number}
     *          Either the index of the value or -1 if the value is not found.
     */
    indexOf(value) {
        return this.value.indexOf(value);
    }

    /**
     * Adds the give value {@link ListType#value} if it is not already there.
     *
     * @private
     * @param   {?} value
     *          Value to add.
     */
    addUnique(value) {

        if (!this.contains(value)) {
            this.value.push(value);
        }

    }

    /**
     * Removes the given value from {@link ListType#value}.
     *
     * @private
     * @param   {?} value
     *          Value to remove.
     */
    removeValue(value) {

        let index = this.indexOf(value);

        if (index > -1) {
            this.value.splice(index, 1);
        }

    }

    /**
     * Coerces the give index so that it becomes a recognised numeric index. If
     * the index cannot be coerced or is outside of the range of
     * {@link ListType#value} then null is returned.
     *
     * @private
     * @param   {Number|String} index
     *          Index to coerce.
     * @return  {Number|null}
     *          Coerced index or null.
     */
    coerceIndex(index) {

        let idx = -1;

        // This filters out situations where `index` is `Symbol.iterator`.
        // Attempting to `Math.floor(Symbol.iterator)` will throw a TypeError.
        if (typeof index === "string" || typeof index === "number") {
            idx = Math.floor(index);
        }

        if (
            idx < 0
            || idx >= this.value.length
            || Number.isNaN(idx)
        ) {
            return null;
        }

        return idx;

    }

    /**
     * Gets the value from {@link ListType#value} but without going through
     * {@link ListType#coerceIndex}.
     *
     * @private
     * @param   {Number|String} index
     *          Index to access.
     * @return  {?}
     *          Value or undefined if the value cannot be found.
     */
    lookup(index) {
        return this.value[index];
    }

    /**
     * Exposes the length of {@link ListType#value}.
     *
     * @private
     * @return  {Number}
     *          Length of {@link ListType#value}.
     */
    size() {
        return this.value.length;
    }

    /**
     * @inheritDoc
     */
    isEmpty() {
        return this.size() === 0;
    }

    /**
     * @inheritDoc
     */
    clear() {
        return this.write([]);
    }

}
