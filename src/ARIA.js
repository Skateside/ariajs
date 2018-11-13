/**
 * @namespace
 */
var ARIA = {

    /**
     * Collection of all valid tokens for any given attribute. The attribute
     * key should be the normalised value - see {@link ARIA.normalise}.
     * @type {[type]}
     */
    tokens: objectAssign(Object.create(null), {
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
    })

};

/**
 * The version of the library.
 *
 * @memberof ARIA
 * @type {String}
 * @constant
 * @name VERSION
 */
Object.defineProperty(ARIA, "VERSION", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: "<%= version %>"
});

var previousAria = globalVariable.ARIA;
globalVariable.ARIA = ARIA;

/**
 * Returns the previous value of the global ARIA variable.
 *
 * @return {?}
 *         Previous ARIA value.
 */
ARIA.getPrevious = function () {
    return previousAria;
};

/**
 * Removes the value of {@link ARIA} from the global variable and sets it back
 * to the previous value. This version of {@link ARIA} is returned.
 *
 * @return {Object}
 *         Current version of {@link ARIA}.
 */
ARIA.restorePrevious = function () {

    globalVariable.ARIA = previousAria;

    return ARIA;

};

/**
 * Name of the property for the {@link ARIA.Element} instance on DOM nodes.
 * @type {String}
 */
ARIA.extendDOM = {

    aria: "aria",

    role: "role"

};
