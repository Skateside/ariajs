// Import the attribute handling classes.
import Attribute from "./attributes/Attribute.js";
import AriaAttribute from "./attributes/AriaAttribute.js";
// Import the types that define the attribute values.
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
// Import the observer that we'll use to listen for attribute updates.
import Observer from "./Observer.js";
// Import the entry point that the library will use.
import Aria from "./references/Aria.js";
// Import the sandbox that we can use for plugins.
import Sandbox from "./Sandbox.js";
// Import the other modules that Sandbox will need.
import Facade from "./facades/Facade.js";
import ListFacade from "./facades/ListFacade.js";
import MediatorFacade from "./facades/MediatorFacade.js";
import Reference from "./references/Reference.js";
import Mediator from "./Mediator.js";

// Set up the factory to create the attributes and types.

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

let factory = Factory.get();

factory.setObserver(new Observer());

factoryEntries.forEach(([Type, attributes, Attr = AriaAttribute]) => {
    attributes.forEach((name) => factory.add(name, Type, Attr));
});

// Setup the sandbox.

let sandbox = new Sandbox();

sandbox[Sandbox.register]({
    Attribute,
    AriaAttribute,
    BasicType,
    FloatType,
    IntegerType,
    ListType,
    ReferenceListType,
    ReferenceType,
    StateType,
    TristateType,
    UndefinedStateType,
    Factory,
    Observer,
    Aria,
    Sandbox,
    Facade,
    ListFacade,
    MediatorFacade,
    Reference,
    Mediator
});

// Set up Aria as the public interface.

let previousAria = window.Aria;

/**
 * Returns the current version of Aria. If the restorePrevious parameter is
 * true then the previous version is removed.
 *
 * @param  {Boolean} [restorePrevious=false]
 *         true to remove the current version and restore the previous version.
 * @return {Aria}
 *         Current version of {@link Aria}.
 */
Aria.noConflict = (restorePrevious = false) => {

    if (restorePrevious) {
        window.Aria = previousAria;
    }

    return Aria;

};

/**
 * A reference to {@link Sandbox.use}.
 * @type {Function}
 */
Aria.plugin = Sandbox.use.bind(Sandbox);

/**
 * The register key for registering new modules for the sandbox.
 * @memberof Aria
 * @constant
 * @name REGISTER
 * @type {Symbol}
 */
Object.defineProperty(Aria, "REGISTER", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Sandbox.register
});

// Expose global Aria.

window.Aria = Aria;
