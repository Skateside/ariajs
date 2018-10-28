/**
 * Helper function for creating the factories.
 *
 * @private
 * @param   {Function} Constructor
 *          Constructor function for creating the element.
 * @param   {Array} [tokens]
 *          Optional tokens for the attribute.
 * @return  {Function}
 *          Function that will create the Constructor.
 */
var makeFactory = function (Constructor, tokens) {

    return function (element, attribute) {

        var property = new Constructor(element, attribute);

        if (tokens && tokens.length) {
            property.setTokens(tokens);
        }

        return property;

    };

};

var AriaProperty = ARIA.Property;
var AriaList = ARIA.List;
var factoryEntries = [
    [AriaProperty, [
        "keyshortcuts",
        "label",
        "placeholder",
        "roledescription",
        "valuetext"
    ]],
    [ARIA.Reference, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [ARIA.ReferenceList, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [ARIA.State, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [ARIA.Tristate, [
        "checked",
        "pressed"
    ]],
    [ARIA.UndefinedState, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [ARIA.Integer, [
        "colcount",
        "colindex",
        "colspan",
        "level",
        "posinset",
        "rowcount",
        "rowindex",
        "rowspan",
        "setsize"
    ]],
    [ARIA.Number, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [AriaProperty, ["autocomplete"], [
        "none",
        "inline",
        "list",
        "both"
    ]],
    [AriaProperty, ["current"], [
        "false",
        "true",
        "page",
        "step",
        "location",
        "date",
        "time"
    ]],
    [AriaProperty, ["haspopup"], [
        "false",
        "true",
        "menu",
        "listbox",
        "tree",
        "grid",
        "dialog"
    ]],
    [AriaProperty, ["invalid"], [
        "false",
        "true",
        "grammar",
        "spelling"
    ]],
    [AriaProperty, ["live"], [
        "off",
        "assertive",
        "polite"
    ]],
    [AriaProperty, ["orientation"], [
        undefined,
        "undefined",
        "horizontal",
        "vertical"
    ]],
    [AriaProperty, ["sort"], [
        "none",
        "ascending",
        "descending",
        "other"
    ]],
    [AriaList, ["dropeffect"], [
        "none",
        "copy",
        "execute",
        "link",
        "move",
        "popup"
    ]],
    [AriaList, ["relevant"], [
        "additions",
        "all",
        "removals",
        "text"
    ]]
];

factoryEntries.forEach(function (entry) {

    entry[1].forEach(function (property) {
        ARIA.factories[property] = makeFactory(entry[0], entry[2]);
    });

});

ARIA.addAlias("labelledby", "labeledby");

// https://github.com/LeaVerou/bliss/issues/49
function addNodeProperty(name, valueMaker, valueGetter, settings) {

    var descriptor = {

        configurable: true,

        get: function getter() {

            Object.defineProperty(Node.prototype, name, {
                get: undefined
            });

            Object.defineProperty(this, name, {
                value: valueMaker(this)
            });

            Object.defineProperty(Node.prototype, name, {
                get: getter
            });

            return (
                typeof valueGetter === "function"
                ? valueGetter(this)
                : this[name]
            );

        }

    };

    if (settings) {

        Object.keys(settings).forEach(function (key) {
            descriptor[key] = settings[key];
        });

    }

    Object.defineProperty(Node.prototype, name, descriptor);

}

addNodeProperty("aria", function (context) {
    return new ARIA.Element(context);
});

// "Authors MUST NOT use abstract roles in content."
// https://www.w3.org/TR/wai-aria-1.1/#abstract_roles
var roles = [
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
];

var roleInstances = new WeakMap();

function getRoleInstance(element) {

    var list = roleInstances.get(element);

    if (!list) {

        list = new ARIA.List(element, "role");
        list.setTokens(roles);
        roleInstances.set(element, list);

    }

    return list;

}

//*
Object.defineProperty(Node.prototype, "role", {

    configurable: true,

    get: function getter() {

        Object.defineProperty(Node.prototype, "role", {
            get: undefined
        });

        Object.defineProperty(this, "role", {
            value: getRoleInstance(this).get()
        });

        Object.defineProperty(Node.prototype, "role", {
            get: getter
        });

        return getRoleInstance(this).get();

    },

    set: function (value) {
        getRoleInstance(this).set(value);
    }

});
/*/
function roleGetter(element) {
    return getRoleInstance(element).get();
}

addNodeProperty("role", roleGetter, roleGetter, {

    set: function (value) {
        getRoleInstance(element).set(value);
    }

});
//*/

globalVariable.ARIA = ARIA;
