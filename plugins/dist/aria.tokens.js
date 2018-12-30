/**
 * @file    Adds a white-list of tokens for attributes and validation for the
 *          values being set.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    /**
     * A simple wrapper for Array#slice.
     *
     * @private
     * @param   {Array|Object} arrayLike
     *          Array or array-like structure to slice.
     * @param   {Number} [offset]
     *          Optional offset for the slice.
     * @return  {Array}
     *          Sliced array.
     */
    var slice = function (arrayLike, offset) {
        return Array.prototype.slice.call(arrayLike, offset);
    };

    /**
     * A simple fall-back for Object.assign.
     *
     * @private
     * @param   {Object} source
     *          Source object to modify.
     * @param   {Object} [...objects]
     *          Additional objects to extend the first.
     * @return  {Object}
     *          Extended object.
     */
    var objectAssign = Object.assign || function (source) {

        slice(arguments, 1).forEach(function (object) {

            if (object) {

                Object.keys(object).forEach(function (key) {
                    source[key] = object[key];
                });

            }

        });

        return source;

    };

    /**
     * A basic fallback for the isNaN function.
     *
     * @private
     * @function
     * @param    {?} value
     *           Value to test.
     * @return   {Boolean}
     *           true if the value is NaN, false otherwise.
     */
    var isNotANumber = Number.isNaN || globalVariable.isNaN;

    var BOOLEAN_TOKENS = [
        "true",
        "false"
    ];

    var triggerBackup;

    if (ARIA && ARIA.VERSION) {

        /**
         * A warning message for invalid tokens.
         * @type {String}
         */
        ARIA.WARNING_INVALID_TOKEN = (
            "'{0}' is not a valid token for the '{1}' attribute"
        );

        /**
         * A flag to enable warnings.
         * @type {Boolean}
         */
        ARIA.enableWarnings = true;

        /**
         * Collection of all valid tokens for any given attribute. The attribute
         * key should be the normalised value - see {@link ARIA.normalise}.
         * @type {Object}
         */
        ARIA.tokens = objectAssign(Object.create(null), {
            "aria-autocomplete": [
                "none",
                "inline",
                "list",
                "both"
            ],
            "aria-current": [
                "false",
                "true",
                "page",
                "step",
                "location",
                "date",
                "time"
            ],
            "aria-dropeffect": [
                "none",
                "copy",
                "execute",
                "link",
                "move",
                "popup"
            ],
            "aria-haspopup": [
                "false",
                "true",
                "menu",
                "listbox",
                "tree",
                "grid",
                "dialog"
            ],
            "aria-invalid": [
                "false",
                "true",
                "grammar",
                "spelling"
            ],
            "aria-live": [
                "off",
                "assertive",
                "polite"
            ],
            "aria-orientation": [
                undefined,
                "undefined",
                "horizontal",
                "vertical"
            ],
            "aria-relevant": [
                "additions",
                "all",
                "removals",
                "text"
            ],
            "aria-sort": [
                "none",
                "ascending",
                "descending",
                "other"
            ],
            // "Authors MUST NOT use abstract roles in content."
            // https://www.w3.org/TR/wai-aria-1.1/#abstract_roles
            "role": [
                "alert",
                "alertdialog",
                "application",
                "article",
                "banner",
                "button",
                "cell",
                "checkbox",
                "columnheader",
                "complementary",
                "combobox",
                // "command", // (abstract)
                // "composite", // (abstract)
                "contentinfo",
                "definition",
                "dialog",
                "directory",
                "document",
                "feed",
                "figure",
                "form",
                "grid",
                "gridcell",
                "group",
                "heading",
                "img",
                // "input", // (abstract)
                // "landmark", // (abstract)
                "link",
                "list",
                "listbox",
                "listitem",
                "log",
                "main",
                "marquee",
                "math",
                "menu",
                "menubar",
                "menuitem",
                "menuitemcheckbox",
                "menuitemradio",
                "navigation",
                "none",
                "note",
                "option",
                "presentation",
                "progressbar",
                "radio",
                "radiogroup",
                // "range", // (abstract)
                "region",
                // "roletype", // (abstract)
                "row",
                "rowgroup",
                "rowheader",
                "scrollbar",
                "search",
                "searchbox",
                // "section", // (abstract)
                // "sectionhead", // (abstract)
                // "select", // (abstract)
                "separator",
                "slider",
                "spinbutton",
                "status",
                // "structure", // (abstract)
                "switch",
                "tab",
                "table",
                "tablist",
                "tabpanel",
                "term",
                "textbox",
                "timer",
                "toolbar",
                "tooltip",
                "tree",
                "treegrid",
                "treeitem"
                // "widget", // (abstract)
                // "window", // (abstract)
            ]
        });

        /**
         * Replaces the placeholders in the string parameter with information
         * from the info parameter. Placeholders are wrapped in brackets
         * e.g. "{0}".
         *
         * @param  {String} string
         *         String containing placeholders.
         * @param  {Array|Object} info
         *         Info to fill the string placeholders.
         * @return {String}
         *         Populated string.
         */
        ARIA.supplant = function (string, info) {

            return string.replace(/\{(\d+)\}/g, function (whole, index) {

                var arg = info[index];

                return (
                    (typeof arg === "string" || typeof arg === "number")
                    ? arg
                    : whole
                );

            });

        };

        /**
         * Sends a warning if {@link ARIA.enableWarnings} is set to true. The
         * message passed will be prefixes with "aria.js: ".
         *
         * @param {String} message
         *        The warning message.
         */
        ARIA.warn = function (message) {

            if (ARIA.enableWarnings) {
                console.warn("aria.js: " + message);
            }

        };

        /**
         * Creates a factory that creates an aria property.
         *
         * @param  {String} attribute
         *         Normalised name of the attribute whose factory is created.
         * @param  {Function} Constructor
         *         Constructor for {@link ARIA.Property} (or sub-class) that
         *         will create the property.
         * @return {Function}
         *         A factory function that takes the element and returns the
         *         instance.
         */
        ARIA.makeFactory = function (attribute, Constructor) {

            return function (element) {

                var tokens = ARIA.tokens[attribute];

                if (!tokens) {

                    tokens = [];
                    ARIA.tokens[attribute] = tokens;

                }

                return new Constructor(element, attribute, tokens);

            };

        };

        triggerBackup = ARIA.Property.prototype.trigger;

        ARIA.Property.addMethods(/** @lends ARIA.Property.prototype */{

            /**
             * @constructs ARIA.Property
             * @param      {Element} element
             *             Element whose attribute should be handled.
             * @param      {String} attribute
             *             Name of the attribute to handle.
             * @param      {Array.<String>} [tokens]
             *             Optional white-list of valid tokens for this
             *             property.
             */
            init: function (element, attribute, tokens) {

                /**
                 * Element whose attribute is being handled.
                 * @type {Element}
                 */
                this.element = element;

                /**
                 * Attribute being handled.
                 * @type {String}
                 */
                this.attribute = attribute;

                /**
                 * White-list of valid tokens. This is a reference to a property
                 * of {@link ARIA.tokens} so updating that property will update
                 * all these instances.
                 * @type {Array.<String>}
                 */
                this.tokens = (
                    (tokens && Array.isArray(tokens))
                    ? tokens
                    : []
                );

                // Things like ARIA.List work with interpretted values rather
                // than just the attribute value. If the attribute already
                // exists, pass the value to the set method to allow for that.
                // As a bonus, this can filter out invalid attribute values.
                if (ARIA.hasAttribute(element, attribute)) {
                    this.set(ARIA.getAttribute(element, attribute));
                }

            },

            /**
             * Checks to see if the given token is valid for this current
             * property. This function checks against
             * {@link ARIA.Property#tokens}. If the token is not valid, a
             * warning it sent. See {@link ARIA.warn}.
             *
             * @param  {String} token
             *         Token to check.
             * @return {Boolean}
             *         true if the token is valid, false otherwise.
             */
            isValidToken: function (token) {

                var tokens = this.tokens;
                var isValid = (
                    !tokens
                    || !tokens.length
                    || tokens.indexOf(token) > -1
                );

                if (!isValid) {

                    ARIA.warn(
                        ARIA.supplant(ARIA.WARNING_INVALID_TOKEN, [
                            token,
                            this.attribute
                        ])
                    );

                }

                return isValid;

            },

            // Documentation is unchanged, but we pass a new method to the
            // detail. No JSDoc way of saying that, as far as I know.
            trigger: function (event, detail) {

                return triggerBackup.call(this, event, objectAssign({
                    isValidToken: this.isValidToken.bind(this)
                }, detail));

            }

        });

        ARIA.List.addMethods(/** @lends ARIA.List.prototype */{

            /**
             * @inheritDoc
             */
            init: function (element, attribute, tokens) {

                /**
                 * The list of values.
                 * @type {Array.<String>}
                 */
                this.list = [];

                this.$super(element, attribute, tokens);

            },

            /**
             * Checks the given tokens to make sure they're all valid.
             *
             * @param  {Array.<String>} tokens
             *         Tokens to validate.
             * @return {Boolean}
             *         true if all tokens are valid, false otherwise.
             */
            areValidTokens: function (tokens) {

                return tokens.every(function (token) {
                    return this.isValidToken(token);
                }, this);

            },

            /**
             * @inheritDoc
             */
            trigger: function (event, detail) {

                return this.$super(event, objectAssign({
                    areValidTokens: this.areValidTokens.bind(this)
                }, detail));

            }

        });

        ARIA.Number.addMethods(/** @lends ARIA.Number.prototype */{

            /**
             * @inheritDoc
             */
            isValidToken: function (value) {

                var interpretted = this.interpret(value);
                var isValid = !isNotANumber(interpretted);
                var attribute = this.attribute;

                if (!isValid) {

                    ARIA.warn(
                        ARIA.supplant(ARIA.WARNING_INVALID_TOKEN, [
                            value,
                            attribute
                        ])
                    );

                }

                return isValid;

            }

        });

        ARIA.State.addMethods(/** @lends ARIA.State.prototype */{

            /**
             * Unlike the parent {@link ARIA.Property}, an instance of
             * ARIA.State always has boolean tokens added.
             *
             * @constructs ARIA.State
             * @param      {Element} element
             *             Element whose attribute should be handled.
             * @param      {String} attribute
             *             Name of the attribute to handle.
             */
            init: function (element, attribute, tokens) {
                this.$super(element, attribute, BOOLEAN_TOKENS.concat(tokens));
            },

            /**
             * @inheritDoc
             */
            isValidToken: function (token) {
                return typeof token === "boolean" || this.$super(token);
            }

        });

        ARIA.Tristate.addMethods(/** @lends ARIA.Tristate.prototype */{

            /**
             * @inheritDoc
             */
            init: function (element, attribute) {
                this.$super(element, attribute, ["mixed"]);
            }

        });

        ARIA.UndefinedState.addMethods(/** @lends ARIA.UndefinedState.prototype */{

            /**
             * @inheritDoc
             */
            init: function (element, attribute) {
                this.$super(element, attribute, ["undefined"]);
            },

            /**
             * @inheritDoc
             */
            isValidToken: function (token) {
                return token === undefined || this.$super(token);
            }

        });

        // Add validation.
        ARIA.on(ARIA.EVENT_PRE_SET, function (e) {

            var detail = e.detail;
            var value = detail.value;
            var isValid = (
                Array.isArray(value)
                ? detail.areValidTokens(value)
                : detail.isValidToken(value)
            );

            if (!isValid) {
                e.preventDefault();
            }

        });

        // Re-make the factories.
        ARIA.createFactories();

    }

}(window.ARIA));

//# sourceMappingURL=aria.tokens.js.map
