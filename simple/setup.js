import Aria from "./Aria.js";
import {
    basicType,
    floatType,
    integerType,
    stateType,
    tristateType,
    undefinedStateType,
    referenceType,
    listType,
    referenceListType
} from "./types.js";

let factoryEntries = [
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

factoryEntries.forEach(([type, properties]) => {

    if (Array.isArray(properties)) {

        properties.forEach((property) => {
            Aria.addType(property, type);
        });

    } else if (properties && typeof properties === "object") {

        Object.entries(properties).forEach(([property, attribute]) => {
            Aria.addType(property, type, attribute);
        });

    }

});

window.Aria = Aria;
