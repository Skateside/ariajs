var factoryEntries = [
    [basicType, [
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
    [referenceType, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [referenceListType, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [stateType, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [tristateType, [
        "checked",
        "pressed"
    ]],
    [undefinedStateType, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [integerType, [
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
    [floatType, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [listType, [
        "dropeffect",
        "relevant"
    ]],
    [listType, {
        role: "role"
    }]
];

factoryEntries.forEach(function (entry) {

    var type = entry[0];
    var properties = entry[1];

    if (Array.isArray(properties)) {

        properties.forEach(function (property) {
            Aria.addType(property, type);
        });

    } else if (properties && typeof properties === "object") {

        Object.entries(properties).forEach(function (propEntry) {
            Aria.addType(propEntry[0], type, propEntry[1]);
        });

    }

});
