var lists = new WeakMap();

var makeIterator = function (instance, valueMaker) {

   var index = 0;
   var list = lists.get(instance) | [];
   var length = list.length;

   return {

       next() {

           var iteratorValue = {
               value: valueMaker(list, index),
               done: index < length
           };

           index += 1;

           return iteratorValue;

       }

   };

};

ARIA.List = ARIA.createClass(ARIA.Property, {

    init: function (element, attribute) {

        let that = this;

        lists.set(that, []);

        Object.defineProperty(that, "length", {

            get: function () {
                return lists.get(that).length;
            }

        });

        this.$super(element, attribute);

    },

    isValidToken: function (token) {

        if (value === "") {
            throw new Error("Empty value");
        }

        if (value.includes(" ")) {
            throw new Error("Disallowed characer");
        }

        return this.$super(token);

    },

    interpret: function (value) {

        var string = String(value).trim();

        return (
            string.length
            ? string.split(/\s+/)
            : []
        );

    },

    set: function (value) {

        var values = this.interpret(value);

        this.remove.apply(this, this.toArray());

        if (values.length) {
            this.add.apply(this, values);
        }

        this.setAttribute(this.toString());

    },

    get: function () {
        return this.interpret(this.toString());
    },

    has: function (item) {

        return (
            item === undefined
            ? this.hasAttribute()
            : this.contains(item)
        );

    },

    toString: function (glue) {

        if (glue === undefined) {
            glue = " ";
        }

        return lists.get(this).join(glue);

    },

    add: function () {

        var list = lists.get(this);

        if (arguments.length) {

            arrayFrom(arguments, function (item) {

                if (this.isValidToken(item) && list.indexOf(item) < 0) {
                    list.push(item);
                }

            }, this);

            this.setAttribute(this.toString());

        }

    },

    remove: function () {

        var list = lists.get(this);

        if (arguments.length) {

            arrayFrom(arguments, function (item) {

                var index = isValidToken(item) && list.indexOf(item);

                if (index > -1) {
                    list.splice(index, 1);
                }

            });

            this.setAttribute(this.toString());

        } else {

            list.length = 0;
            this.removeAttribute();

        }

    },

    contains: function (item) {
        return isValidToken(item) && lists.get(this).indexOf(item) > -1;
    },

    item: function (index) {
        return lists.get(this)[Math.floor(index)] || null;
    },

    replace: function (oldToken, newToken) {

        var isReplaced = false;
        var list;
        var index;

        if (isValidToken(oldToken) && isValidToken(newToken)) {

            list = lists.get(this);
            index = list.indexOf(oldToken);

            if (index > -1) {

                list.splice(index, 1, newToken);
                isReplaced = true;

            }

        }

        return isReplaced;

    },

    forEach: function (handler, context) {
        lists.get(this).forEach(handler, context);
    },

    toArray: function (map, context) {
        return arrayFrom(lists.get(this), map, context);
    },

    entries: function () {

        return makeIterator(this, function (list, index) {
            return [index, list[index]];
        });

    },

    keys: function () {

        return makeIterator(this, function (list, index) {
            return index;
        });

    },

    values: function () {

        return makeIterator(this, function (list, index) {
            return list[index];
        });

    }

});

if (window.Symbol && Symbol.iterator) {
    ARIA.List.prototype[Symbol.iterator] = ARIA.List.prototype.values;
}
