var types = Aria.types;
var factoryEntries = [
    [types.basic, [
        "autocomplete",
        "current",
        "haspopup",
        "invalid",
        "keyshortcuts",
        "label",
        "live",
        "orientation",
        "placeholder",
        "roledescription",
        "sort",
        "valuetext"
    ]],
    [types.reference, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [types.referenceList, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [types.state, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [types.tristate, [
        "checked",
        "pressed"
    ]],
    [types.undefinedState, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [types.integer, [
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
    [types.float, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [types.list, [
        "dropeffect",
        "relevant"
    ]],
    [types.list, {
        role: "role"
    }]
];

factoryEntries.forEach(function (entry) {

    var type = entry[0];
    var properties = entry[1];

    if (Array.isArray(properties)) {

        properties.forEach(function (property) {
            Aria.addProperty(property, type);
        });

    } else if (properties && typeof properties === "object") {

        Object.entries(properties).forEach(function (propEntry) {
            Aria.addProperty(propEntry[0], type, propEntry[1]);
        });

    }

});
