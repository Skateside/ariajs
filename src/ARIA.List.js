/**
 * The arrays for {@link ARIA.List} instances. This prevents the array from
 * being exposed and manipulated.
 * @private
 * @type {WeakMap}
 */
var lists = new WeakMap();

/**
 * Creates an iterator.
 *
 * @private
 * @param   {ARIA.List} instance
 *          Instance that should gain an iterator.
 * @param   {Function} valueMaker
 *          Function to get the iterator value from the item.
 * @return  {Object}
 *          Iterator response.
 */
var makeIterator = function (instance, valueMaker) {

   var index = 0;
   var list = instance.get();
   var length = list.length;

   return {

       next: function () {

           var iteratorValue = {
               value: valueMaker(list, index),
               done: index >= length
           };

           index += 1;

           return iteratorValue;

       },

       toString: function () {
           return "Array Iterator";
       }

   };

};

/**
 * A version of DOMException that we can actually create.
 *
 * @class
 * @private
 * @extends Error
 * @param   {String} type
 *          Type of exception.
 * @param   {String} message
 *          Message for the exception.
 */
var DOMEx = function (type, message) {

    this.name = type;
    this.code = DOMException[type];
    this.message = message;

};
DOMEx.prototype = Error.prototype;
// DOMEx taken from:
// https://github.com/yola/classlist-polyfill/blob/master/src/index.js

/**
 * Handles a WAI-ARIA attribute that should be a space-separated list. This is
 * moddled on DOMTokenList (such as classList) so it will only accept unique
 * values and will throw errors for invalid values (see
 * {@link ARIA.List#isValidToken}).
 *
 * @class ARIA.List
 * @extends ARIA.Property
 */
ARIA.List = ARIA.createClass(ARIA.Property, /** ARIA.List.prototype */{

    /**
     * @inheritDoc
     */
    init: function (element, attribute) {

        var that = this;

        lists.set(that, []);

        /**
         * The number of items in this list.
         *
         * @name length
         * @memberof ARIA.List
         * @instance
         * @type {Number}
         */
        Object.defineProperty(that, "length", {

            get: function () {
                return lists.get(that).length;
            }

        });

        this.$super(element, attribute);

    },

    /**
     * Ensures that the token is valid.
     *
     * @param  {?} token
     *         Token to check.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     * @throws {DOMEx}
     *         Given token cannot be an empty string.
     * @throws {DOMEx}
     *         Given token cannot contain a space.
     */
    isValidToken: function (token) {

        if (token === "") {

            throw new DOMEx(
                "SYNTAX_ERR",
                "An invalid or illegal string was specified"
            );

        }

        if ((/\s/).test(token)) {

            throw new DOMEx(
                "INVALID_CHARACTER_ERR",
                "String contains an invalid character"
            );

        }

        return this.$super(token);

    },

    /**
     * Coerces the values into a string and splits it at the spaces.
     *
     * @param  {?} value
     *         Value to interpret.
     * @return {Array.<String>}
     *         Array of strings.
     */
    interpret: function (value) {

        var val = (
            Array.isArray(value)
            ? value.join(" ")
            : value
        );
        var string = this.$super(val);

        return (
            string.length
            ? string.split(/\s+/)
            : []
        );

    },

    /**
     * Sets the value of the list to be the given value, removing all previous
     * values first. To add to the previous values, use {@link ARIA.List#add}.
     * The values are interpretted as an array (see {@link ARIA.List#interpret}
     * and validated (see {@link ARIA.List#isValidToken}); only unique values
     * are added.
     *
     * @param {?} value
     *        Value(s) to add. If the given value is a string, it is assumed to
     *        be a space-separated list.
     */
    set: function (value) {

        var values = this.interpret(value);
        var unwanted = this
            .toArray()
            .filter(function (item) {
                return values.indexOf(item) < 0;
            });
console.log("ARIA.List#set(%o) for attribute %o; values = %o; unwanted = %o", value, this.attribute, values, unwanted);
        if (values.length) {
            this.add.apply(this, values);
        }

        if (unwanted.length) {
            this.remove.apply(this, unwanted);
        }

        this.setAttribute(this.toString());

    },

    /**
     * Gets the value of the attribute as an array.
     *
     * @return {Array.<String>}
     *         Value of the attribute as an array.
     */
    get: function () {
        return this.interpret(this.toString());
    },

    /**
     * Checks to see if the attribute is set. If a parameter is passed, the list
     * is checked to see if it contains the value.
     *
     * @param  {String} [item]
     *         Optional value to check.
     * @return {Boolean}
     *         true if the attribute exists or the value is in the list, false
     *         otherwise.
     */
    has: function (item) {

        return (
            item === undefined
            ? this.hasAttribute()
            : this.contains(item)
        );

    },

    /**
     * Converts the attribute into a string. Optionally, a string can be passed
     * to be used as the glue for the array.
     *
     * @param  {String} [glue=" "]
     *         Optional glue to use to join the array.
     * @return {String}
     *         String from the list.
     */
    toString: function (glue) {

        if (glue === undefined) {
            glue = " ";
        }

        return lists.get(this).join(glue);

    },

    /**
     * Adds the given values to the list. Items are only added if they're valid
     * (see {@link ARIA.List#isValidToken}) and not already in the list.
     *
     * @param {String} ...arguments
     *        Arguments to add.
     */
    add: function () {

        var list = lists.get(this);

        if (arguments.length) {

            arrayFrom(arguments, function (argument) {

                var item = this.interpret(argument)[0];

                if (this.isValidToken(item) && list.indexOf(item) < 0) {
                    list.push(item);
                }

            }, this);

            this.setAttribute(this.toString());

        }

    },

    /**
     * Either removes one or more values from the list or the attribute itself
     * if no parameters are passed.
     *
     * @param {String} [...arguments]
     *        Optional values to remove.
     */
    remove: function () {

        var list = lists.get(this);
        var string;

        if (arguments.length) {

            arrayFrom(arguments, function (argument) {

                var item = this.interpret(argument)[0];
                var index = this.isValidToken(item) && list.indexOf(item);

                if (index > -1) {
                    list.splice(index, 1);
                }

            }, this);

            string = this.toString();

            if (string === "") {
                this.removeAttribute();
            } else {
                this.setAttribute(string);
            }

        } else {

            list.length = 0;
            this.removeAttribute();

        }

    },

    /**
     * Checks to see if the given item is within the list.
     *
     * @param  {String} item
     *         Item to check for.
     * @return {Boolean}
     *         true if the item is within the list, false otherwise.
     */
    contains: function (item) {

        var value = this.interpret(item)[0];

        return this.isValidToken(value) && lists.get(this).indexOf(value) > -1;

    },

    /**
     * Gets the item from the list at the specified index. If there is no item
     * at that index, null is returned.
     *
     * @param  {Number} index
     *         Index of the item to retrieve.
     * @return {String|null}
     *         The item at the given index or null if there is no item at that
     *         index.
     */
    item: function (index) {
        return lists.get(this)[Math.floor(index)] || null;
    },

    /**
     * Replaces one value with another one.
     *
     * @param  {String} oldToken
     *         Old value to replace.
     * @param  {String} newToken
     *         New token.
     * @return {Boolean}
     *         true if a replacement was made, false otherwise.
     */
    replace: function (oldToken, newToken) {

        var isReplaced = false;
        var list;
        var index;
        var oldItem = this.interpret(oldToken)[0];
        var newItem = this.interpret(newToken)[0];

        if (this.isValidToken(oldItem) && this.isValidToken(newItem)) {

            list = lists.get(this);
            index = list.indexOf(oldItem);

            if (index > -1) {

                list.splice(index, 1, newItem);
                isReplaced = true;

            }

        }

        return isReplaced;

    },

    /**
     * Loops over the items within the array.
     *
     * @param {Function} handler
     *        Function to execute on each item.
     * @param {?} [context]
     *        Optional context for the function.
     */
    forEach: function (handler, context) {
        lists.get(this).forEach(handler, context);
    },

    /**
     * Converts the list into an array. Optionally, the values can be converted
     * by passing a mapping function.
     *
     * @param  {Function} [map]
     *         Optional conversion function.
     * @param  {?} context
     *         Optional context for the optional function.
     * @return {Array}
     *         Array made from the list.
     */
    toArray: function (map, context) {
        return arrayFrom(lists.get(this), map, context);
    },

    /**
     * Returns an iterator for the entries.
     *
     * @return {Object}
     *         Iterator value.
     */
    entries: function () {

        return makeIterator(this, function (list, index) {
            return [index, list[index]];
        });

    },

    /**
     * Returns an iterator for the keys.
     *
     * @return {Object}
     *         Iterator value.
     */
    keys: function () {

        return makeIterator(this, function (list, index) {
            return index;
        });

    },

    /**
     * Returns an iterator for the values.
     *
     * @return {Object}
     *         Iterator value.
     */
    values: function () {

        return makeIterator(this, function (list, index) {
            return list[index];
        });

    }

});

if (window.Symbol && Symbol.iterator) {
    ARIA.List.prototype[Symbol.iterator] = ARIA.List.prototype.values;
}
