(function (Aria) {

    "use strict";

    if (!Aria || !Aria.VERSION) {
        return;
    }

    /**
     * A collection of attributes against their valid tokens. Tokens are
     * case-sensitive. Only the string value needs to be added; booleans and
     * undefined are coerced into strings ("true", "false", "undefined" etc.).
     * @type {Object}
     */
    Aria.tokens = {
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
        "role": [

            // "Authors MUST NOT use abstract roles in content."
            // https://www.w3.org/TR/wai-aria-1.1/#abstract_roles
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
            "treeitem",
            // "widget", // (abstract)
            // "window", // (abstract)

            // https://www.w3.org/TR/dpub-aria-1.0/
            "doc-abstract",
            "doc-acknowledgments",
            "doc-afterword",
            "doc-appendix",
            "doc-backlink",
            "doc-biblioentry",
            "doc-bibliography",
            "doc-biblioref",
            "doc-chapter",
            "doc-colophon",
            "doc-conclusion",
            "doc-cover",
            "doc-credit",
            "doc-credits",
            "doc-dedication",
            "doc-endnote",
            "doc-endnotes",
            "doc-epigraph",
            "doc-epilogue",
            "doc-errata",
            "doc-example",
            "doc-footnote",
            "doc-foreword",
            "doc-glossary",
            "doc-glossref",
            "doc-index",
            "doc-introduction",
            "doc-noteref",
            "doc-notice",
            "doc-pagebreak",
            "doc-pagelist",
            "doc-part",
            "doc-preface",
            "doc-prologue",
            "doc-pullquote",
            "doc-qna",
            "doc-subtitle",
            "doc-tip",
            "doc-toc"

        ]
    };

    /**
     * Checks to see if the given token is valid for the given attribute.
     *
     * @param  {String} coerced
     *         Coerced value to check.
     * @param  {String} attribute
     *         Full attribute.
     * @return {Boolean}
     *         true if the token is valid, false otherwise.
     */
    Aria.isValidToken = function (coerced, attribute) {

        var tokens = Aria.tokens[attribute];

        return (
            coerced === ""
            || !tokens
            || tokens.indexOf(coerced) > -1
        );

    };

    // Tweak type.read() and type.write() so that they accept the attribute
    // name, which we can use to check against the tokens.

    /**
     * @inheritDoc
     */
    Aria.prototype.read = function (property, value) {

        var attribute = property.name;

        return property.type.read(
            this.element.getAttribute(attribute),
            attribute
        );

    };

    /**
     * @inheritDoc
     */
    Aria.prototype.write = function (property, value) {

        var attribute = property.name;
        var writable = property.type.write(value, attribute);

        if (writable !== "") {
            this.element.setAttribute(attribute, writable);
        } else {
            this.delete(property);
        }

    };

    var types = Aria.types;

    // We only need to tweak the basic type. All other types will coerce the
    // given value so it's impossible to pass a bad value.
    types.basic.write = function (value, attribute) {

        var coerced = this.coerce(value);

        if (Aria.isValidToken(coerced, attribute)) {
            return coerced;
        }

        console.warn(
            "Aria.js: The %s attribute can not accept the value \"%s\"",
            attribute,
            coerced
        );
        return "";

    };

    // Tweak the list type slightly to take advantage of the basic type's
    // upgrade.
    types.list.write = function (value, attribute) {

        return this
            .asArray(value)
            .map(function (item) {
                return this.type.write(item, attribute);
            }, this)
            .filter(Boolean)
            .join(" ");

    };

    /**
     * A version of the basic type that allows the value to be a boolean.
     * @extends Aria.types.basic
     * @type {Object}
     * @name tokenState
     * @memberof Aria.types
     */
    types.tokenState = Object.assign({}, types.basic, {

        /**
         * If the value is empty then false is returned (this is always the
         * default value). If the value is "true" or "false" then the boolean
         * value should be returned. In all other cases, the value should be
         * returned as normal.
         *
         * @param  {String|null} value
         *         Value to read.
         * @param  {String} attribute
         *         Attribute that's being read.
         * @return {String|boolean}
         *         Either the value or a boolean if the value is supposed to be
         *         a boolean.
         */
        read: function (value, attribute) {

            if (value === "" || value === null || value === undefined) {
                return false;
            }

            if ((/^true|false$/).test(value)) {
                return value === "true";
            }

            var read = types.basic.read(value);

            return (
                Aria.isValidToken(read, attribute)
                ? read
                : false
            );

        }

    });

    /**
     * A version of the basic type that allows undefined to be a value.
     * @extends Aria.types.basic
     * @type {Object}
     * @name tokenUndefined
     * @memberof Aria.types
     */
    types.tokenUndefined = Object.assign({}, types.basic, {

        /**
         * Coerces the undefined literal to "undefined".
         *
         * @param  {?} value
         *         Value to coerce.
         * @return {String}
         *         Coerced value.
         */
        coerce: function (value) {

            return (
                value === undefined
                ? "undefined"
                : types.basic.coerce(value)
            );

        },

        /**
         * If value is empty then undefined is returned. For all other values,
         * this method acts like {@link Aria.types.basic.read}.
         *
         * @param  {String|null} value
         *         Value to read.
         * @param  {String} attribute
         *         Attribute that's being read.
         * @return {String|undefined}
         *         Either the value or undefined if the value is supposed to be
         *         undefined.
         */
        read: function (value, attribute) {

            if (value === "undefined" || value === "" || value === null) {
                return undefined;
            }

            var read = types.basic.read(value);

            return (
                Aria.isValidToken(read, attribute)
                ? read
                : undefined
            );

        }

    });

    // Set up the new types for any attributes that need them.
    Object.entries(Aria.tokens).forEach(function (entry) {

        var property = Aria.unprefix(entry[0]);
        var values = entry[1];

        // This should include aria-current, aria-haspopup, and aria-invalid.
        if (values.indexOf("true") > -1 && values.indexOf("false") > -1) {
            Aria.addProperty(property, types.tokenState);

        // This will probably only ever be for aria-orientation.
        } else if (values.indexOf("undefined") > -1) {
            Aria.addProperty(property, types.tokenUndefined);
        }

    });

}(window.Aria));
