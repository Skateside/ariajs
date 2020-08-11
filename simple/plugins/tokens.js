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

    // Tweak this function so that type.write() accepts the attribute name,
    // which we can use to check against tokens.
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
        var tokens = Aria.tokens[attribute];

        if (
            coerced === ""
            || (attribute && tokens && tokens.indexOf(coerced) > -1)
        ) {
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
     * A version of the basic type that allows undefined to be a value.
     * @extends Aria.types.basic
     * @type {Object}
     * @name undefinedBasic
     * @memberof Aria.types
     */
    types.undefinedBasic = Object.assign({}, types.basic, {

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
         * @return {String|undefined}
         *         Either the value or undefined if the value is supposed to be
         *         undefined.
         */
        read: function (value) {

            return (
                (value === "undefined" || value === "" || value === null)
                ? undefined
                : types.basic.read(value)
            );

        },

    });

    // aria-orientation is the only attribute that uses the new undefinedBasic
    // type, so replace the value we currently have.
    Aria.addProperty("orientation", types.undefinedBasic);

}(window.Aria));
