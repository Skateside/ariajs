import {
    interpretString,
    interpretLowerString,
    clearCache,
    prefix,
    unprefix,
    addTranslation,
    translate
} from "./util.js";
import AriaElement from "./AriaElement.js";
import Factory from "./Factory.js";
import Property from "./constructors/Property.js";
import AriaNumber from "./constructors/AriaNumber.js";
import Integer from "./constructors/Integer.js";
import State from "./constructors/State.js";
import Tristate from "./constructors/Tristate.js";
import UndefinedState from "./constructors/UndefinedState.js";
import List from "./constructors/List.js";
import Reference from "./constructors/Reference.js";
import ReferenceList from "./constructors/ReferenceList.js";

// Create the base ARIA object.

let ARIA = {};

Object.defineProperty(ARIA, "VERSION", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: "<%= version %>"
});

// Create the global variable restoration.

let previousAria = window.ARIA;
window.ARIA = ARIA;

ARIA.getPrevious = (remove = false) => {

    if (remove) {
        window.ARIA = previousAria;
    }

    return previousAria;

};

// Add the properties to the ARIA object.

Object.assign(ARIA, {
    Element: AriaElement,
    Factory,
    Property,
    Number: AriaNumber,
    Integer,
    State,
    Tristate,
    UndefinedState,
    List,
    Reference,
    ReferenceList,
    interpretString,
    interpretLowerString,
    clearCache,
    prefix,
    unprefix,
    addTranslation,
    translate
});

// Set up the factories.

let factoryEntries = [
    [Property, [
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
    [Reference, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [ReferenceList, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [State, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [Tristate, [
        "checked",
        "pressed"
    ]],
    [UndefinedState, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [Integer, [
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
    [AriaNumber, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [List, [
        "dropeffect",
        "relevant",
        "role"
    ]]
];

let factory = new Factory();

factoryEntries.forEach(([Constructor, attributes]) => {
    attributes.forEach((attribute) => factory.add(attribute, Constructor));
});

AriaElement.factory = factory;
