var makeFactory = function (Constructor, tokens, pattern) {

    return function (element, attribute) {

        var property = new Constructor(element, attribute);

        if (tokens && tokens.length) {
            property.setTokens(tokens);
        }

        if (pattern) {
            property.setPattern(pattern);
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
    // [AriaList, [
    //     "role"
    // ]],
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
    [AriaProperty, [
        "colcount",
        "colindex",
        "colspan",
        "level",
        "posinset",
        "rowcount",
        "rowindex",
        "rowspan",
        "setsize"
    ], undefined, /^\d+$/],
    [AriaProperty, [
        "valuemax",
        "valuemin",
        "valuenow"
    ], undefined, /^(\d+(\.\d+)?)|\.\d+$/],
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
    ]],
];

factoryEntries.forEach(function (entry) {

    entry[1].forEach(function (property) {
        ARIA.factories[property] = makeFactory(entry[0], entry[2], entry[3]);
    });

});

ARIA.addAlias("labelledby", "labeledby");

// https://github.com/LeaVerou/bliss/issues/49
function addNodeProperty(name, valueMaker) {

    Object.defineProperty(Node.prototype, name, {

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

            return this[name];

        }

    });

}

addNodeProperty("aria", function (context) {
    return new ARIA.Element(context);
});

addNodeProperty("role", function (context) {
    return new AriaList(context, "role");
});

globalVariable.ARIA = ARIA;
