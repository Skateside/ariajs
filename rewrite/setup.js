// Import the attribute handling classes.
import Attribute from "./attributes/Attribute.js";
import AriaAttribute from "./attributes/AriaAttribute.js";
// Improt the types that define the attribute values.
import BasicType from "./types/BasicType.js";
import FloatType from "./types/FloatType.js";
import IntegerType from "./types/IntegerType.js";
import ListType from "./types/ListType.js";
import ReferenceListType from "./types/ReferenceListType.js";
import ReferenceType from "./types/ReferenceType.js";
import StateType from "./types/StateType.js";
import TristateType from "./types/TristateType.js";
import UndefinedStateType from "./types/UndefinedStateType.js";
// Import the factory that will create the attibute interaction objects.
import Factory from "./Factory.js";
// Import the entry point that the library will use.
import Aria from "./references/Aria.js";

let factoryEntries = [
    [BasicType, [
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
    [ReferenceType, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [ReferenceListType, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [StateType, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [TristateType, [
        "checked",
        "pressed"
    ]],
    [UndefinedStateType, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [IntegerType, [
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
    [FloatType, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [ListType, [
        "dropeffect",
        "relevant"
    ]],
    [ListType, ["role"], Attribute]
];

let factory = Factory.create();

factoryEntries.forEach(([Type, attributes, Attr = AriaAttribute]) => {
    attributes.forEach((name) => factory.add(name, Type, Attr));
});

window.Aria = Aria;
