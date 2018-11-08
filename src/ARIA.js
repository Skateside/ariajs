/**
 * @namespace
 */
var ARIA = {

    /**
     * Collection of factories for creating WAI-ARIA libraries. The attribute
     * key should be the attribute suffixes (e.g. "label" for "aria-label" etc.)
     * @type {Object}
     */
    factories: Object.create(null),

    /**
     * Map of all mis-spellings and aliases. The attribute key should be the
     * normalised value - see {@link ARIA.normalise}.
     * @type {Object}
     */
    translate: Object.create(null),

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

/**
 * Gets the factory from {@link ARIA.factories} that matches either the given
 * attribute or the normalised version (see {@link ARIA.normalise}).
 *
 * @param  {String} attribute
 *         Attribute whose factory should be returned.
 * @return {Function}
 *         Factory for creating the attribute.
 */
ARIA.getFactory = function (attribute) {

    return (
        ARIA.factories[attribute]
        || ARIA.factories[ARIA.normalise(attribute)]
    );

};

/**
 * Executes the factory for the given attribute, passing in given parameters.
 * See {@link ARIA.getFactory}.
 *
 * @param  {String} attribute
 *         Attribute whose factory should be executed.
 * @param  {...?} [arguments]
 *         Optional parameters to pass to the factory.
 * @return {?}
 *         Result of executing the factory.
 * @throws {ReferenceError}
 *         There must be a factory for the given attribute.
 */
ARIA.runFactory = function (attribute) {

    var factory = ARIA.getFactory(attribute);

    if (!factory) {
        throw new ReferenceError(attribute + " is not a recognised factory");
    }

    return factory.apply(undefined, slice(arguments, 1));

};

/**
 * Creates an alias of WAI-ARIA attributes.
 *
 * @param  {String} source
 *         Source attribute for the alias.
 * @param  {Array.<String>|String} aliases
 *         Either a single alias or an array of aliases.
 * @throws {ReferenceError}
 *         The source attribute must have a related factory.
 */
ARIA.addAlias = function (source, aliases) {

    var normalSource = ARIA.normalise(source).slice(5);

    if (!Array.isArray(aliases)) {
        aliases = [aliases];
    }

    if (!ARIA.getFactory(normalSource)) {

        throw new ReferenceError(
            "ARIA.factories."
            + normalSource
            + " does not exist"
        );

    }

    aliases.forEach(function (alias) {

        var normalAlias = ARIA.normalise(alias).slice(5);

        ARIA.translate[normalAlias] = normalSource;
        ARIA.factories[normalAlias] = ARIA.factories[normalSource];

    });

};

globalVariable.ARIA = ARIA;
