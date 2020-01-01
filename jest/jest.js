// Polyfill as necessary.

import MutationObserver from "mutation-observer";
global.MutationObserver = MutationObserver;

// Test all the things!

// import "./Factory.js"; // TODO: Write these tests.
// import "./Mediator.js"; // TODO: Write these tests.
import "./Observer.js";
// import "./Sandbox.js"; // TODO: Write these tests.

// Attributes.
import "./attributes/Attribute.js";
import "./attributes/AriaAttribute.js";

// References.
import "./references/Reference.js";
import "./references/Aria.js";

// Types.
import "./types/BasicType.js";
import "./types/ObservableBasicType.js";
import "./types/FloatType.js";
import "./types/IntegerType.js";
import "./types/ListType.js";
import "./types/ReferenceType.js";
import "./types/ReferenceListType.js";
import "./types/StateType.js";
import "./types/TristateType.js";
import "./types/UndefinedStateType.js";
